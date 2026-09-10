<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	let containerEl = $state<HTMLDivElement | null>(null);
	let isDragging = $state(false);
	let isHovered = $state(false);

	onMount(() => {
		if (!containerEl) return;

		let animFrameId: number;
		let isIntersecting = true;

		// --- Scene, Camera, Renderer ---
		const scene = new THREE.Scene();

		const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
		camera.position.set(0, 0.05, 9.2);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.2;
		containerEl.appendChild(renderer.domElement);

		// --- Studio Lighting ---
		const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
		scene.add(ambientLight);

		const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
		keyLight.position.set(4, 5, 5);
		scene.add(keyLight);

		const rimLight = new THREE.DirectionalLight(0xa0c4ff, 1.8);
		rimLight.position.set(-4, -1, -2);
		scene.add(rimLight);

		const topLight = new THREE.DirectionalLight(0xffffff, 1.8);
		topLight.position.set(0, 6, 2);
		scene.add(topLight);

		// Environment map for metallic clip reflections
		const pmremGenerator = new THREE.PMREMGenerator(renderer);
		pmremGenerator.compileEquirectangularShader();
		const envScene = new THREE.Scene();
		const envL1 = new THREE.DirectionalLight(0xffffff, 3);
		envL1.position.set(2, 4, 3);
		envScene.add(envL1);
		const envL2 = new THREE.DirectionalLight(0x8899aa, 2);
		envL2.position.set(-3, -2, -2);
		envScene.add(envL2);
		const envMap = pmremGenerator.fromScene(envScene).texture;

		// --- Badge Texture (1376 x 1376) ---
		// Left: Front face (0..688, 0..1042)
		// Right: Back face (688..1376, 0..1042)
		const texW = 1376;
		const texH = 1376;
		const cardCanvas = document.createElement('canvas');
		cardCanvas.width = texW;
		cardCanvas.height = texH;
		const ctx = cardCanvas.getContext('2d')!;

		function renderBadgeTexture(avatarImg?: HTMLImageElement) {
			ctx.fillStyle = '#090a0d';
			ctx.fillRect(0, 0, texW, texH);

			const frontW = 688;
			const maxH = 1042;

			// ==========================================
			// 1. FRONT FACE (Clean layout with empty slot area)
			// ==========================================
			const fGrad = ctx.createLinearGradient(0, 0, 0, maxH);
			fGrad.addColorStop(0, '#14161d');
			fGrad.addColorStop(0.35, '#0c0e13');
			fGrad.addColorStop(1, '#060709');
			ctx.fillStyle = fGrad;
			ctx.fillRect(0, 0, frontW, maxH);

			// Outer hairline border
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
			ctx.lineWidth = 10;
			ctx.strokeRect(20, 20, frontW - 40, maxH - 40);

			// NOTE: The top 0..150px is where the metal clip clamps through the slot!
			// We leave the slot area clean so the clip does NOT cover any text!

			// Holographic security foil strip (below clip)
			const holoGrad = ctx.createLinearGradient(30, 160, frontW - 30, 172);
			holoGrad.addColorStop(0, 'rgba(160, 200, 255, 0.4)');
			holoGrad.addColorStop(0.3, 'rgba(255, 210, 160, 0.45)');
			holoGrad.addColorStop(0.7, 'rgba(170, 255, 210, 0.45)');
			holoGrad.addColorStop(1, 'rgba(210, 170, 255, 0.4)');
			ctx.fillStyle = holoGrad;
			ctx.fillRect(30, 160, frontW - 60, 12);

			// Header branding text (BELOW THE CLIP!)
			ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
			ctx.font = '700 20px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('IDENTITY PASS // 2026', frontW / 2, 205);

			// Avatar container box
			const avatarSize = 370;
			const avatarX = (frontW - avatarSize) / 2;
			const avatarY = 225;

			ctx.fillStyle = '#060709';
			ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

			if (avatarImg) {
				ctx.save();
				ctx.beginPath();
				ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 24);
				ctx.clip();
				ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
				ctx.restore();
			} else {
				ctx.fillStyle = '#1c1f26';
				ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
			}

			// Avatar frame border
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
			ctx.lineWidth = 5;
			ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize);

			// Active status pill overlay on photo
			ctx.fillStyle = 'rgba(9, 11, 15, 0.92)';
			ctx.beginPath();
			ctx.roundRect(avatarX + 20, avatarY + avatarSize - 52, 176, 38, 10);
			ctx.fill();
			ctx.fillStyle = '#10b981';
			ctx.beginPath();
			ctx.arc(avatarX + 38, avatarY + avatarSize - 33, 6, 0, Math.PI * 2);
			ctx.fill();
			ctx.fillStyle = '#ffffff';
			ctx.font = '700 16px monospace';
			ctx.textAlign = 'left';
			ctx.fillText('ACTIVE · ID', avatarX + 54, avatarY + avatarSize - 27);

			// Name & Title
			ctx.fillStyle = '#ffffff';
			ctx.font = '800 52px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('IVAN MALDINI', frontW / 2, 660);

			ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
			ctx.font = '600 22px monospace';
			ctx.fillText('FRONTEND DEVELOPER', frontW / 2, 702);

			// Metadata divider
			ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
			ctx.fillRect(50, 735, frontW - 100, 2);

			// Metadata items
			const metaY = 785;
			ctx.textAlign = 'left';
			ctx.font = '600 16px monospace';
			ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
			ctx.fillText('AFFILIATION', 60, metaY);
			ctx.fillText('CORE FOCUS', 380, metaY);

			ctx.font = '700 22px sans-serif';
			ctx.fillStyle = '#f0f2f5';
			ctx.fillText('PT Yapindo Jaya Abadi', 60, metaY + 34);
			ctx.fillText('SvelteKit & TS', 380, metaY + 34);

			// Barcode divider
			ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
			ctx.fillRect(50, 868, frontW - 100, 2);

			// Barcode graphic
			ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
			const barWidths = [4, 10, 5, 14, 4, 8, 12, 4, 16, 5, 8, 4, 12, 6, 4, 14, 5, 10, 4, 16, 5, 8, 12, 4, 8];
			let curX = 80;
			for (let i = 0; i < 32; i++) {
				const bw = barWidths[i % barWidths.length];
				ctx.fillRect(curX, 895, bw, 62);
				curX += bw + 6;
				if (curX > frontW - 80) break;
			}

			ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
			ctx.font = '500 16px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('UUID // 7702-0941-DEV-ID-2026', frontW / 2, 995);

			// ==========================================
			// 2. BACK FACE
			// ==========================================
			const backX = frontW;
			const bGrad = ctx.createLinearGradient(backX, 0, backX, maxH);
			bGrad.addColorStop(0, '#12141a');
			bGrad.addColorStop(0.5, '#08090d');
			bGrad.addColorStop(1, '#040507');
			ctx.fillStyle = bGrad;
			ctx.fillRect(backX, 0, frontW, maxH);

			ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
			ctx.lineWidth = 10;
			ctx.strokeRect(backX + 20, 20, frontW - 40, maxH - 40);

			// Monogram Box on back
			const logoSize = 160;
			const logoX = backX + (frontW - logoSize) / 2;
			const logoY = 350;

			ctx.fillStyle = '#060709';
			ctx.fillRect(logoX, logoY, logoSize, logoSize);
			ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
			ctx.lineWidth = 4;
			ctx.strokeRect(logoX, logoY, logoSize, logoSize);

			ctx.fillStyle = '#ffffff';
			ctx.font = '800 76px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('IM', backX + frontW / 2, logoY + 110);

			ctx.fillStyle = '#ffffff';
			ctx.font = '700 32px sans-serif';
			ctx.fillText('IVAN MALDINI', backX + frontW / 2, 575);

			ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
			ctx.font = '600 20px monospace';
			ctx.fillText('PORTFOLIO · ALL ACCESS', backX + frontW / 2, 620);
			ctx.fillText('github.com/ipang004', backX + frontW / 2, 660);

			ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
			ctx.font = '500 16px monospace';
			ctx.fillText('SVELTEKIT · TYPESCRIPT · THREE.JS', backX + frontW / 2, 985);
		}

		renderBadgeTexture();
		const cardTexture = new THREE.CanvasTexture(cardCanvas);
		cardTexture.colorSpace = THREE.SRGBColorSpace;
		cardTexture.flipY = false;

		const portraitImg = new Image();
		portraitImg.src = '/photos/ivan-portrait.jpg';
		portraitImg.onload = () => {
			renderBadgeTexture(portraitImg);
			cardTexture.needsUpdate = true;
		};

		// --- 3D Scene Nodes ---
		const cardGroup = new THREE.Group();
		scene.add(cardGroup);

		const modelScale = 3.4;
		let strapAnchor: THREE.Object3D | null = null;

		const gltfLoader = new GLTFLoader();
		gltfLoader.load('/models/card.glb', (gltf) => {
			const model = gltf.scene;
			let clipMesh: THREE.Object3D | null = null;

			model.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					mesh.castShadow = true;
					mesh.receiveShadow = true;

					if (mesh.name === 'card') {
						mesh.material = new THREE.MeshPhysicalMaterial({
							map: cardTexture,
							roughness: 0.15,
							metalness: 0.05,
							clearcoat: 1.0,
							clearcoatRoughness: 0.08,
							reflectivity: 0.85
						});
					} else if (mesh.name === 'clip' || mesh.name === 'clamp') {
						mesh.material = new THREE.MeshStandardMaterial({
							color: 0xf5f7fb,
							metalness: 0.98,
							roughness: 0.12,
							envMap: envMap
						});
					}

					if (mesh.name === 'clip') {
						clipMesh = mesh;
					}
				}
			});

			model.scale.set(modelScale, modelScale, modelScale);

			// Center model by its card badge geometry
			const box = new THREE.Box3().setFromObject(model);
			const center = new THREE.Vector3();
			box.getCenter(center);
			model.position.set(-center.x, -center.y, -center.z);

			if (clipMesh) {
				strapAnchor = new THREE.Object3D();
				// Center of the oval ring hole in clip local space
				strapAnchor.position.set(0, 1.174, 0);
				clipMesh.add(strapAnchor);
			}

			cardGroup.add(model);
		});

		// --- Authentic Matte Black Fabric Lanyard Strap (Double Neck Loop) ---
		const strapMat = new THREE.MeshStandardMaterial({
			color: 0x16181d,
			roughness: 0.95,
			metalness: 0.02,
			side: THREE.DoubleSide
		});

		// Balanced anchor points for strap
		const anchorLeft = new THREE.Vector3(-0.32, 3.2, -0.05);
		const anchorRight = new THREE.Vector3(0.32, 3.2, -0.05);
		let strapGroup: THREE.Group | null = null;

		function createRibbonGeometry(p0: THREE.Vector3, p3: THREE.Vector3, width: number, cardRot: THREE.Euler) {
			const p1 = new THREE.Vector3(
				p0.x * 0.7 + p3.x * 0.3,
				p0.y * 0.65 + p3.y * 0.35 - 0.08,
				p0.z * 0.5 + p3.z * 0.5 + 0.06
			);
			const p2 = new THREE.Vector3(
				p0.x * 0.3 + p3.x * 0.7,
				p0.y * 0.35 + p3.y * 0.65 - 0.04,
				p0.z * 0.5 + p3.z * 0.5 + 0.04
			);

			const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
			const numPoints = 24;
			const points = curve.getPoints(numPoints);

			const ribbonHalfW = width * 0.5;
			const geom = new THREE.BufferGeometry();
			const vertices: number[] = [];
			const indices: number[] = [];

			// Ring normal direction rotated with card
			const topNormal = new THREE.Vector3(1, 0, 0);
			const bottomNormal = new THREE.Vector3(1, 0, 0).applyEuler(cardRot).normalize();

			for (let i = 0; i <= numPoints; i++) {
				const pt = points[i];
				const frac = i / numPoints;

				// Interpolate orientation from top down to the ring's angle
				const normal = new THREE.Vector3().lerpVectors(topNormal, bottomNormal, frac).normalize();

				const v1 = pt.clone().addScaledVector(normal, ribbonHalfW);
				const v2 = pt.clone().addScaledVector(normal, -ribbonHalfW);

				vertices.push(v1.x, v1.y, v1.z);
				vertices.push(v2.x, v2.y, v2.z);

				if (i < numPoints) {
					const base = i * 2;
					indices.push(base, base + 1, base + 2);
					indices.push(base + 1, base + 3, base + 2);
				}
			}

			geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
			geom.setIndex(indices);
			geom.computeVertexNormals();
			return geom;
		}

		function updateStrap(clipPos: THREE.Vector3) {
			if (strapGroup) {
				scene.remove(strapGroup);
				strapGroup.traverse((c) => {
					if ((c as THREE.Mesh).geometry) (c as THREE.Mesh).geometry.dispose();
				});
			}

			strapGroup = new THREE.Group();

			// Two elegant fabric ribbons meeting seamlessly at the clamp ring
			const ribbonWidth = 0.12;
			const geomLeft = createRibbonGeometry(anchorLeft, clipPos, ribbonWidth, rot);
			const geomRight = createRibbonGeometry(anchorRight, clipPos, ribbonWidth, rot);

			const meshLeft = new THREE.Mesh(geomLeft, strapMat);
			const meshRight = new THREE.Mesh(geomRight, strapMat);

			// Small fabric loop that folds right inside the ring
			const loopGeom = new THREE.TorusGeometry(0.045, 0.02, 12, 24);
			const loopMesh = new THREE.Mesh(loopGeom, strapMat);
			loopMesh.position.copy(clipPos);
			loopMesh.rotation.copy(rot);

			strapGroup.add(meshLeft);
			strapGroup.add(meshRight);
			strapGroup.add(loopMesh);
			scene.add(strapGroup);
		}

		// --- Physics Simulation ---
		const restingPos = new THREE.Vector3(0, 0.0, 0);
		const pos = restingPos.clone();
		const vel = new THREE.Vector3(0, 0, 0);

		// Natural 3D isometric resting angle
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

		let lastPointerMoveTime = performance.now();
		let targetMouseParallaxX = 0;
		let targetMouseParallaxY = 0;

		function onPointerDown(e: PointerEvent) {
			const rect = containerEl!.getBoundingClientRect();
			pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
			pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

			raycaster.setFromCamera(pointer, camera);
			const intersects = raycaster.intersectObjects(cardGroup.children, true);

			if (intersects.length > 0) {
				isDragging = true;
				containerEl!.setPointerCapture(e.pointerId);

				raycaster.ray.intersectPlane(dragPlane, intersectionPoint);
				dragOffset.copy(cardGroup.position).sub(intersectionPoint);
				vel.set(0, 0, 0);
			}
		}

		function onPointerMove(e: PointerEvent) {
			const rect = containerEl!.getBoundingClientRect();
			pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
			pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

			targetMouseParallaxX = pointer.x * 0.22;
			targetMouseParallaxY = pointer.y * 0.12;

			raycaster.setFromCamera(pointer, camera);

			if (!isDragging) {
				const hits = raycaster.intersectObjects(cardGroup.children, true);
				isHovered = hits.length > 0;
				return;
			}

			if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
				const now = performance.now();
				const dt = Math.max((now - lastPointerMoveTime) / 1000, 0.001);
				lastPointerMoveTime = now;

				const targetPos = intersectionPoint.clone().add(dragOffset);

				// Distance constrain from center anchor
				const centerAnchor = new THREE.Vector3(0, 3.2, 0);
				const toAnchor = targetPos.clone().sub(centerAnchor);
				const maxLen = 3.8;
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
				try {
					containerEl?.releasePointerCapture(e.pointerId);
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

		// --- Resize Observer ---
		function handleResize() {
			if (!containerEl) return;
			const width = containerEl.clientWidth;
			const height = containerEl.clientHeight;
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		}

		const resizeObserver = new ResizeObserver(() => handleResize());
		resizeObserver.observe(containerEl);
		handleResize();

		const observer = new IntersectionObserver(([entry]) => {
			isIntersecting = entry.isIntersecting;
		});
		observer.observe(containerEl);

		// --- Render & Physics Loop ---
		let lastTime = performance.now();

		function animate() {
			animFrameId = requestAnimationFrame(animate);

			if (!isIntersecting) return;

			const now = performance.now();
			const dt = Math.min((now - lastTime) / 1000, 0.033);
			lastTime = now;

			if (!isDragging) {
				const springK = 15.0;
				const damping = 0.94;
				const gravity = -9.8;

				const centerAnchor = new THREE.Vector3(0, 3.2, 0);
				const toAnchor = pos.clone().sub(centerAnchor);
				const currentLen = toAnchor.length();
				const targetLen = 3.2;

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

			const clipWorldPos = new THREE.Vector3();
			if (strapAnchor) {
				strapAnchor.getWorldPosition(clipWorldPos);
			} else {
				clipWorldPos.set(0, 1.2, 0).applyMatrix4(cardGroup.matrixWorld);
			}
			updateStrap(clipWorldPos);

			renderer.render(scene, camera);
		}

		animate();

		return () => {
			cancelAnimationFrame(animFrameId);
			resizeObserver.disconnect();
			observer.disconnect();
			containerEl?.removeEventListener('pointerdown', onPointerDown);
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerup', onPointerUp);

			cardTexture.dispose();
			strapMat.dispose();
			pmremGenerator.dispose();
			envMap.dispose();
			renderer.dispose();
		};
	});
</script>

<div class="relative w-full h-[540px] sm:h-[620px] md:h-[680px] flex items-center justify-center select-none overflow-visible">
	<div
		bind:this={containerEl}
		class="w-full h-full touch-none {isDragging ? 'cursor-grabbing' : isHovered ? 'cursor-grab' : 'cursor-default'}"
		style="touch-action: none;"
	></div>

	<!-- Minimalist Clean Floating Badge Hint -->
	<div
		class="pointer-events-none absolute bottom-2 right-4 sm:bottom-4 sm:right-6 font-mono text-[11px] text-muted-foreground/60
			flex items-center gap-2 border border-border/40 bg-card/70 backdrop-blur-md px-3 py-1.5 rounded-full transition-opacity duration-300"
		class:opacity-20={isDragging}
	>
		<span class="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse"></span>
		<span>drag & fling 3D badge</span>
	</div>
</div>
