<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { createBadgeTexture } from './lanyard/badge-texture';
	import { buildHolderCase } from './lanyard/holder-case';
	import { createLanyardStrap } from './lanyard/strap';
	import { createPhysicsController } from './lanyard/physics';

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
		camera.position.set(0, -0.35, 9.0);

		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			powerPreference: 'high-performance'
		});
		// Optimized pixel ratio to prevent GPU fill-rate lag on high-DPI retina screens
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		renderer.outputColorSpace = THREE.SRGBColorSpace;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1.2;
		containerEl.appendChild(renderer.domElement);

		// --- Lighting ---
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

		// --- Badge Texture ---
		const badge = createBadgeTexture();

		const portraitImg = new Image();
		portraitImg.src = '/photos/ivan-portrait.jpg';
		portraitImg.onload = () => {
			badge.updateAvatar(portraitImg);
		};

		// --- 3D Card Model ---
		const cardGroup = new THREE.Group();
		scene.add(cardGroup);

		let strapAnchor: THREE.Object3D | null = null;

		const gltfLoader = new GLTFLoader();
		gltfLoader.load('/models/card.glb', (gltf) => {
			const model = gltf.scene;

			model.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					mesh.castShadow = true;
					mesh.receiveShadow = true;

					if (mesh.name === 'card') {
						mesh.material = new THREE.MeshPhysicalMaterial({
							map: badge.texture,
							roughness: 0.2,
							metalness: 0.05,
							clearcoat: 0.7,
							clearcoatRoughness: 0.1,
							reflectivity: 0.75
						});
					} else if (mesh.name === 'clip' || mesh.name === 'clamp') {
						mesh.material = new THREE.MeshStandardMaterial({
							color: 0xf5f7fb,
							metalness: 0.98,
							roughness: 0.12,
							envMap: envMap
						});
					}
				}
			});

			const cardMesh = model.getObjectByName('card') as THREE.Mesh | null;
			if (cardMesh) {
				buildHolderCase(cardMesh, envMap);
			}

			// Align clip assembly directly into the reinforced top hanger slot hole
			const clipObj = model.getObjectByName('clip');
			const clampObj = model.getObjectByName('clamp');
			const clipHangerOffset = 0.170;
			if (clipObj) clipObj.position.y += clipHangerOffset;
			if (clampObj) clampObj.position.y += clipHangerOffset;

			model.scale.set(2.15, 2.15, 2.15);

			if (cardMesh && cardMesh.geometry.boundingBox) {
				const cardCenter = cardMesh.geometry.boundingBox.getCenter(new THREE.Vector3());
				model.position.set(-cardCenter.x, -cardCenter.y, -cardCenter.z);
			} else {
				const box = new THREE.Box3().setFromObject(model);
				const center = new THREE.Vector3();
				box.getCenter(center);
				model.position.set(-center.x, -center.y, -center.z);
			}

			const anchorTarget = clipObj || clampObj;
			if (anchorTarget) {
				strapAnchor = new THREE.Object3D();
				strapAnchor.position.set(0, 1.174, 0);
				anchorTarget.add(strapAnchor);
			}

			cardGroup.add(model);
		});

		// --- Lanyard Strap (Zero-Allocation In-Place Vertex Buffer) ---
		const loopApex = new THREE.Vector3(0, 3.2, -0.06);
		const loopHalfWidth = 0.25;
		const strap = createLanyardStrap(loopApex, loopHalfWidth, 0.105);
		scene.add(strap.group);

		// --- Physics & Interaction Controller ---
		const physics = createPhysicsController(containerEl, camera, cardGroup, loopApex, {
			restingY: -1.25,
			targetLen: 4.45,
			maxLen: 5.3,
			onDragChange: (val) => (isDragging = val),
			onHoverChange: (val) => (isHovered = val)
		});

		// --- Resize Observer ---
		function handleResize() {
			if (!containerEl) return;
			const width = containerEl.clientWidth;
			const height = containerEl.clientHeight;
			camera.aspect = width / height;

			// Dynamically adjust camera distance on narrow mobile viewports so the card is perfectly framed
			if (width < 340) {
				camera.position.z = 9.8;
			} else if (width < 400) {
				camera.position.z = 9.4;
			} else {
				camera.position.z = 9.0;
			}

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

		// --- Render Loop ---
		let lastTime = performance.now();
		const clipWorldPos = new THREE.Vector3();

		function animate() {
			animFrameId = requestAnimationFrame(animate);

			if (!isIntersecting) return;

			const now = performance.now();
			const dt = Math.min((now - lastTime) / 1000, 0.033);
			lastTime = now;

			physics.step(dt, now);

			if (strapAnchor) {
				strapAnchor.getWorldPosition(clipWorldPos);
			} else {
				clipWorldPos.set(0, 1.2, 0).applyMatrix4(cardGroup.matrixWorld);
			}

			strap.update(clipWorldPos, physics.rot);

			renderer.render(scene, camera);
		}

		animate();

		return () => {
			cancelAnimationFrame(animFrameId);
			resizeObserver.disconnect();
			observer.disconnect();
			physics.destroy();
			badge.dispose();
			strap.dispose();
			pmremGenerator.dispose();
			envMap.dispose();
			renderer.dispose();
		};
	});
</script>

<div class="relative w-full h-[500px] sm:h-[620px] lg:h-[780px] flex items-center justify-center select-none overflow-visible">
	<div
		bind:this={containerEl}
		class="w-full h-full {isDragging ? 'cursor-grabbing' : isHovered ? 'cursor-grab' : 'cursor-default'}"
		style="touch-action: {isDragging ? 'none' : 'pan-y'};"
	></div>
</div>
