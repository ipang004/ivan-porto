import * as THREE from 'three';

export interface PhysicsController {
	rot: THREE.Euler;
	step: (dt: number, now: number) => void;
	destroy: () => void;
}

export function createPhysicsController(
	containerEl: HTMLElement,
	camera: THREE.PerspectiveCamera,
	cardGroup: THREE.Group,
	loopApex: THREE.Vector3,
	options?: {
		restingY?: number;
		targetLen?: number;
		maxLen?: number;
		onDragChange?: (dragging: boolean) => void;
		onHoverChange?: (hovered: boolean) => void;
	}
): PhysicsController {
	const restingY = options?.restingY ?? -1.25;
	const targetLen = options?.targetLen ?? 4.45;
	const maxLen = options?.maxLen ?? 5.3;

	const restingPos = new THREE.Vector3(0, restingY, 0);
	const pos = restingPos.clone();
	const vel = new THREE.Vector3(0, 0, 0);

	const baseRotX = -0.1;
	const baseRotY = 0.28;
	const baseRotZ = -0.05;

	const rot = new THREE.Euler(baseRotX, baseRotY, baseRotZ, 'YXZ');
	const rotVel = new THREE.Vector3(0, 0, 0);

	const pointer = new THREE.Vector2();
	const raycaster = new THREE.Raycaster();
	const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
	const intersectionPoint = new THREE.Vector3();
	const dragOffset = new THREE.Vector3();

	let isDragging = false;
	let isHovered = false;
	let lastPointerMoveTime = performance.now();
	let targetMouseParallaxX = 0;
	let targetMouseParallaxY = 0;

	function onPointerDown(e: PointerEvent) {
		const rect = containerEl.getBoundingClientRect();
		pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(pointer, camera);
		const intersects = raycaster.intersectObjects(cardGroup.children, true);

		if (intersects.length > 0) {
			isDragging = true;
			options?.onDragChange?.(true);
			containerEl.setPointerCapture(e.pointerId);

			raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
			dragOffset.copy(cardGroup.position).sub(intersectionPoint);
			vel.set(0, 0, 0);
		}
	}

	function onPointerMove(e: PointerEvent) {
		const rect = containerEl.getBoundingClientRect();
		pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
		pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

		targetMouseParallaxX = pointer.x * 0.22;
		targetMouseParallaxY = pointer.y * 0.12;

		raycaster.setFromCamera(pointer, camera);

		if (!isDragging) {
			const hits = raycaster.intersectObjects(cardGroup.children, true);
			const hovered = hits.length > 0;
			if (hovered !== isHovered) {
				isHovered = hovered;
				options?.onHoverChange?.(hovered);
			}
			return;
		}

		if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
			const now = performance.now();
			const dt = Math.max((now - lastPointerMoveTime) / 1000, 0.001);
			lastPointerMoveTime = now;

			const targetPos = intersectionPoint.clone().add(dragOffset);

			// Distance constrain from anchor behind navbar
			const centerAnchor = loopApex;
			const toAnchor = targetPos.clone().sub(centerAnchor);
			if (toAnchor.length() > maxLen) {
				toAnchor.setLength(maxLen);
				targetPos.copy(centerAnchor).add(toAnchor);
			}

			vel.copy(targetPos).sub(pos).divideScalar(dt).clampLength(0, 30);
			pos.copy(targetPos);
		}
	}

	function onPointerUp(e: PointerEvent) {
		if (isDragging) {
			isDragging = false;
			options?.onDragChange?.(false);
			try {
				containerEl.releasePointerCapture(e.pointerId);
			} catch {
				// ignore
			}
			rotVel.x = vel.y * 0.14;
			rotVel.y = -vel.x * 0.32;
			rotVel.z = vel.x * 0.08;
		}
	}

	containerEl.addEventListener('pointerdown', onPointerDown);
	window.addEventListener('pointermove', onPointerMove);
	window.addEventListener('pointerup', onPointerUp);

	function step(dt: number, now: number) {
		if (!isDragging) {
			const springK = 15.0;
			const damping = 0.94;
			const gravity = -9.8;

			const centerAnchor = loopApex;
			const toAnchor = pos.clone().sub(centerAnchor);
			const currentLen = toAnchor.length();

			const springForce = pos.clone().sub(restingPos).multiplyScalar(-springK);
			vel.addScaledVector(springForce, dt);
			vel.y += gravity * dt;

			if (currentLen > targetLen) {
				const excess = currentLen - targetLen;
				const normal = toAnchor.clone().normalize();
				vel.addScaledVector(normal, -excess * 26);
			}

			vel.multiplyScalar(damping);
			pos.addScaledVector(vel, dt);

			// Gentle natural ambient breathing sway
			const time = now * 0.0016;
			pos.x += Math.sin(time * 1.1) * 0.0016;
			pos.z += Math.cos(time * 0.8) * 0.0014;

			const targetAngleX = baseRotX - targetMouseParallaxY;
			const targetAngleY = baseRotY + targetMouseParallaxX + Math.sin(time * 1.1) * 0.06;
			const targetAngleZ = baseRotZ + Math.cos(time * 0.9) * 0.03;

			rotVel.x += (targetAngleX - rot.x + vel.y * 0.08) * 7 * dt;
			rotVel.y += (targetAngleY - rot.y - vel.x * 0.15) * 7 * dt;
			rotVel.z += (targetAngleZ - rot.z - vel.x * 0.07) * 7 * dt;

			rotVel.multiplyScalar(0.92);
			rot.x += rotVel.x * dt;
			rot.y += rotVel.y * dt;
			rot.z += rotVel.z * dt;
		} else {
			rot.x = THREE.MathUtils.lerp(rot.x, THREE.MathUtils.clamp(-vel.y * 0.04, -0.65, 0.65), 0.2);
			rot.y = THREE.MathUtils.lerp(rot.y, THREE.MathUtils.clamp(-vel.x * 0.08, -0.85, 0.85), 0.2);
			rot.z = THREE.MathUtils.lerp(rot.z, THREE.MathUtils.clamp(vel.x * 0.05, -0.45, 0.45), 0.2);
		}

		cardGroup.position.copy(pos);
		cardGroup.rotation.copy(rot);
		cardGroup.updateMatrixWorld(true);
	}

	function destroy() {
		containerEl.removeEventListener('pointerdown', onPointerDown);
		window.removeEventListener('pointermove', onPointerMove);
		window.removeEventListener('pointerup', onPointerUp);
	}

	return {
		rot,
		step,
		destroy
	};
}
