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
			ctx.fillStyle = '#faf6ed';
			ctx.fillRect(0, 0, texW, texH);

			const frontW = 688;
			const maxH = 1042;

			// Helper to draw Ben-Day halftone dots on canvas
			function drawHalftoneDots(startX: number, startY: number, w: number, h: number, spacing: number, radius: number, dotColor: string) {
				ctx.fillStyle = dotColor;
				for (let y = startY; y < startY + h; y += spacing) {
					for (let x = startX; x < startX + w; x += spacing) {
						ctx.beginPath();
						ctx.arc(x, y, radius, 0, Math.PI * 2);
						ctx.fill();
					}
				}
			}

			// ==========================================
			// 1. FRONT FACE (Retro Pop-Art Comic Pass)
			// ==========================================
			// Warm comic collector cardstock
			ctx.fillStyle = '#fffdf9';
			ctx.fillRect(0, 0, frontW, maxH);

			// Ben-Day halftone dot screen in background
			drawHalftoneDots(20, 20, frontW - 40, maxH - 40, 16, 1.4, 'rgba(24, 24, 27, 0.08)');

			// Outer comic panel border (bold ink line)
			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 6;
			ctx.strokeRect(20, 20, frontW - 40, maxH - 40);

			// Inner hairline frame
			ctx.strokeStyle = 'rgba(24, 24, 27, 0.2)';
			ctx.lineWidth = 1.5;
			ctx.strokeRect(30, 30, frontW - 60, maxH - 60);

			// Header Comic Strip Banner (Vibrant Comic Yellow)
			ctx.fillStyle = '#fbbf24';
			ctx.fillRect(32, 140, frontW - 64, 52);
			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 3;
			ctx.strokeRect(32, 140, frontW - 64, 52);

			// Header branding text
			ctx.fillStyle = '#18181b';
			ctx.font = '900 18px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('★ HERO PASS // ISSUE NO. 01 ★', frontW / 2, 173);

			// Avatar container box (comic character panel)
			const avatarSize = 370;
			const avatarX = (frontW - avatarSize) / 2;
			const avatarY = 210;

			ctx.fillStyle = '#f4f4f5';
			ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);

			if (avatarImg) {
				ctx.save();
				ctx.beginPath();
				ctx.roundRect(avatarX, avatarY, avatarSize, avatarSize, 8);
				ctx.clip();
				
				// FULL NATURAL COLOR PHOTO — Vibrant & crisp!
				ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
				ctx.restore();
			} else {
				ctx.fillStyle = '#e4e4e7';
				ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
			}

			// Inked portrait frame with solid black border & offset comic drop
			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 4;
			ctx.strokeRect(avatarX, avatarY, avatarSize, avatarSize);

			// Comic Corner Accents
			ctx.fillStyle = '#f43f5e';
			ctx.fillRect(avatarX - 2, avatarY - 2, 16, 6);
			ctx.fillRect(avatarX - 2, avatarY - 2, 6, 16);
			ctx.fillStyle = '#0284c7';
			ctx.fillRect(avatarX + avatarSize - 14, avatarY - 2, 16, 6);
			ctx.fillRect(avatarX + avatarSize - 4, avatarY - 2, 6, 16);

			// Active status badge (comic pop pill)
			ctx.fillStyle = '#18181b';
			ctx.fillRect(avatarX + 16, avatarY + avatarSize - 44, 200, 32);
			ctx.fillStyle = '#10b981';
			ctx.fillRect(avatarX + 14, avatarY + avatarSize - 46, 200, 32);
			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 2;
			ctx.strokeRect(avatarX + 14, avatarY + avatarSize - 46, 200, 32);

			ctx.fillStyle = '#ffffff';
			ctx.beginPath();
			ctx.arc(avatarX + 30, avatarY + avatarSize - 30, 5, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = '#ffffff';
			ctx.font = '900 12px monospace';
			ctx.textAlign = 'left';
			ctx.fillText('ACTIVE · LEVEL 99 DEV', avatarX + 44, avatarY + avatarSize - 26);

			// Name & Title (Comic Pop Typography)
			ctx.fillStyle = '#18181b';
			ctx.font = '900 52px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('IVAN MALDINI', frontW / 2, 646);

			ctx.fillStyle = '#0284c7';
			ctx.font = '800 20px monospace';
			ctx.fillText('★ FRONTEND ARCHITECT ★', frontW / 2, 684);

			// Comic divider line
			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 2.5;
			ctx.beginPath();
			ctx.moveTo(50, 712); ctx.lineTo(frontW - 50, 712);
			ctx.stroke();

			// Metadata items
			const metaY = 756;
			ctx.textAlign = 'left';
			ctx.font = '900 13px monospace';
			ctx.fillStyle = '#f59e0b';
			ctx.fillText('// AFFILIATION', 55, metaY);
			ctx.fillText('// CORE ARSENAL', 380, metaY);

			ctx.font = '800 20px sans-serif';
			ctx.fillStyle = '#18181b';
			ctx.fillText('PT Yapindo Jaya Abadi', 55, metaY + 26);
			ctx.fillText('SvelteKit & TS', 380, metaY + 26);

			// Barcode divider
			ctx.strokeStyle = 'rgba(24, 24, 27, 0.2)';
			ctx.lineWidth = 1.5;
			ctx.beginPath();
			ctx.moveTo(50, 836); ctx.lineTo(frontW - 50, 836);
			ctx.stroke();

			// Comic barcode (solid black ink)
			ctx.fillStyle = '#18181b';
			const barWidths = [4, 9, 5, 13, 4, 8, 12, 4, 15, 5, 8, 4, 12, 6, 4, 14, 5, 10, 4, 15, 5, 8, 12, 4, 8, 11, 4];
			let curX = 65;
			for (let i = 0; i < 34; i++) {
				const bw = barWidths[i % barWidths.length];
				ctx.fillRect(curX, 860, bw, 60);
				curX += bw + 6;
				if (curX > frontW - 65) break;
			}

			ctx.fillStyle = '#18181b';
			ctx.font = '800 13px monospace';
			ctx.textAlign = 'center';
			ctx.fillText('SERIAL // 004-IVAN-COMIC-COLLECTOR-2026', frontW / 2, 960);

			// ==========================================
			// 2. BACK FACE (Vintage Comic Cover Seal)
			// ==========================================
			const backX = frontW;
			ctx.fillStyle = '#fef08a'; // Comic Yellow Back Face!
			ctx.fillRect(backX, 0, frontW, maxH);

			drawHalftoneDots(backX + 20, 20, frontW - 40, maxH - 40, 14, 1.4, 'rgba(24, 24, 27, 0.12)');

			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 6;
			ctx.strokeRect(backX + 20, 20, frontW - 40, maxH - 40);

			// Comic Emblem Stamp on back
			const logoSize = 180;
			const logoX = backX + (frontW - logoSize) / 2;
			const logoY = 300;

			ctx.fillStyle = '#ffffff';
			ctx.fillRect(logoX, logoY, logoSize, logoSize);
			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 4;
			ctx.strokeRect(logoX, logoY, logoSize, logoSize);

			ctx.fillStyle = '#f43f5e';
			ctx.font = '900 84px sans-serif';
			ctx.textAlign = 'center';
			ctx.fillText('IM', backX + frontW / 2, logoY + 120);

			ctx.fillStyle = '#18181b';
			ctx.font = '900 34px sans-serif';
			ctx.fillText('IVAN MALDINI', backX + frontW / 2, 545);

			// Stamp Badge
			ctx.fillStyle = '#0284c7';
			ctx.font = '900 18px monospace';
			ctx.fillText('★ COMICS CODE APPROVED ★', backX + frontW / 2, 590);

			ctx.fillStyle = '#18181b';
			ctx.font = '800 16px monospace';
			ctx.fillText('GITHUB.COM/IPANG004', backX + frontW / 2, 630);

			ctx.strokeStyle = '#18181b';
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(backX + 80, 665); ctx.lineTo(backX + frontW - 80, 665);
			ctx.stroke();

			ctx.fillStyle = '#57534e';
			ctx.font = '700 15px monospace';
			ctx.fillText('SVELTEKIT · TYPESCRIPT · THREE.JS', backX + frontW / 2, 705);
			ctx.fillText('SERIALIZED IN JAKARTA, ID // 2026', backX + frontW / 2, 735);
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
			let cardMesh: THREE.Mesh | null = null;

			model.traverse((child) => {
				if ((child as THREE.Mesh).isMesh) {
					const mesh = child as THREE.Mesh;
					mesh.castShadow = true;
					mesh.receiveShadow = true;

					if (mesh.name === 'card') {
						cardMesh = mesh;
						mesh.material = new THREE.MeshPhysicalMaterial({
							map: cardTexture,
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

					if (mesh.name === 'clip') {
						clipMesh = mesh;
					}
				}
			});

			// --- Procedural 3D Crystal Clear Transparent Acrylic Badge Holder Case ---
			if (cardMesh) {
				const cardGeo = (cardMesh as THREE.Mesh).geometry;
				cardGeo.computeBoundingBox();
				const cardBox = cardGeo.boundingBox!;
				const cw = cardBox.max.x - cardBox.min.x;
				const ch = cardBox.max.y - cardBox.min.y;
				const cd = Math.max(cardBox.max.z - cardBox.min.z, 0.02);
				const cc = cardBox.getCenter(new THREE.Vector3());

				// Holder Case dimensions (slim, snug, natural fit around card)
				const caseW = cw + 0.06;
				const caseH = ch + 0.06;
				const cornerR = 0.04;

				// Premium Crystal Clear Polycarbonate / Acrylic Material
				const clearCaseMat = new THREE.MeshPhysicalMaterial({
					color: 0xffffff,
					transparent: true,
					opacity: 0.6,
					roughness: 0.05,
					metalness: 0.05,
					clearcoat: 1.0,
					clearcoatRoughness: 0.03,
					transmission: 0.95, // 100% see-through clear acrylic plastic
					ior: 1.49,          // Refractive index of acrylic / PMMA
					thickness: 0.03,
					reflectivity: 0.95,
					envMap: envMap,
					depthWrite: false
				});

				// 1. Front Slim Clear Bezel Frame with Window Opening
				const frameShape = new THREE.Shape();
				const fx0 = -caseW / 2;
				const fy0 = -caseH / 2;

				frameShape.moveTo(fx0 + cornerR, fy0);
				frameShape.lineTo(fx0 + caseW - cornerR, fy0);
				frameShape.quadraticCurveTo(fx0 + caseW, fy0, fx0 + caseW, fy0 + cornerR);
				frameShape.lineTo(fx0 + caseW, fy0 + caseH - cornerR);
				frameShape.quadraticCurveTo(fx0 + caseW, fy0 + caseH, fx0 + caseW - cornerR, fy0 + caseH);
				frameShape.lineTo(fx0 + cornerR, fy0 + caseH);
				frameShape.quadraticCurveTo(fx0, fy0 + caseH, fx0, fy0 + caseH - cornerR);
				frameShape.lineTo(fx0, fy0 + cornerR);
				frameShape.quadraticCurveTo(fx0, fy0, fx0 + cornerR, fy0);

				// Window cutout hole (snug fit)
				const winW = cw * 0.97;
				const winH = ch * 0.97;
				const winR = 0.03;
				const wx0 = -winW / 2;
				const wy0 = -winH / 2;

				const winHole = new THREE.Path();
				winHole.moveTo(wx0 + winR, wy0);
				winHole.lineTo(wx0 + winW - winR, wy0);
				winHole.quadraticCurveTo(wx0 + winW, wy0, wx0 + winW, winR + wy0);
				winHole.lineTo(wx0 + winW, wy0 + winH - winR);
				winHole.quadraticCurveTo(wx0 + winW, wy0 + winH, wx0 + winW - winR, wy0 + winH);
				winHole.lineTo(wx0 + winR, wy0 + winH);
				winHole.quadraticCurveTo(wx0, wy0 + winH, wx0, wy0 + winH - winR);
				winHole.lineTo(wx0, wy0 + winR);
				winHole.quadraticCurveTo(wx0, wy0, wx0 + winR, wy0);
				frameShape.holes.push(winHole);

				const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
					depth: 0.008,
					bevelEnabled: true,
					bevelSegments: 2,
					steps: 1,
					bevelSize: 0.004,
					bevelThickness: 0.004
				});

				const frontFrameMesh = new THREE.Mesh(frameGeo, clearCaseMat);
				frontFrameMesh.position.set(cc.x, cc.y, cc.z + cd / 2 + 0.003);
				frontFrameMesh.castShadow = true;
				frontFrameMesh.receiveShadow = true;
				cardMesh.add(frontFrameMesh);

				// 2. Crystal Clear Acrylic Protective Front Glass Sheet
				const glassGeo = new THREE.PlaneGeometry(winW, winH);
				const glassMesh = new THREE.Mesh(glassGeo, clearCaseMat);
				glassMesh.position.set(cc.x, cc.y, cc.z + cd / 2 + 0.002);
				cardMesh.add(glassMesh);

				// 3. Clear Back Casing Plate with Classic Teardrop Thumb Hole (like in photo)
				const backShape = new THREE.Shape();
				backShape.moveTo(fx0 + cornerR, fy0);
				backShape.lineTo(fx0 + caseW - cornerR, fy0);
				backShape.quadraticCurveTo(fx0 + caseW, fy0, fx0 + caseW, fy0 + cornerR);
				backShape.lineTo(fx0 + caseW, fy0 + caseH - cornerR);
				backShape.quadraticCurveTo(fx0 + caseW, fy0 + caseH, fx0 + caseW - cornerR, fy0 + caseH);
				backShape.lineTo(fx0 + cornerR, fy0 + caseH);
				backShape.quadraticCurveTo(fx0, fy0 + caseH, fx0, fy0 + caseH - cornerR);
				backShape.lineTo(fx0, fy0 + cornerR);
				backShape.quadraticCurveTo(fx0, fy0, fx0 + cornerR, fy0);

				// Inverted teardrop thumb hole in center of back plate
				const tearW = cw * 0.28;
				const tearH = ch * 0.32;
				const tearY = -0.1;
				const tearHole = new THREE.Path();
				tearHole.moveTo(-tearW / 2, tearY + tearH * 0.3);
				tearHole.lineTo(-tearW * 0.35, tearY + tearH);
				tearHole.quadraticCurveTo(0, tearY + tearH + 0.04, tearW * 0.35, tearY + tearH);
				tearHole.lineTo(tearW / 2, tearY + tearH * 0.3);
				tearHole.quadraticCurveTo(tearW / 2, tearY, 0, tearY);
				tearHole.quadraticCurveTo(-tearW / 2, tearY, -tearW / 2, tearY + tearH * 0.3);
				backShape.holes.push(tearHole);

				const backGeo = new THREE.ExtrudeGeometry(backShape, {
					depth: 0.008,
					bevelEnabled: true,
					bevelSegments: 2,
					steps: 1,
					bevelSize: 0.003,
					bevelThickness: 0.003
				});

				const backMesh = new THREE.Mesh(backGeo, clearCaseMat);
				backMesh.position.set(cc.x, cc.y, cc.z - cd / 2 - 0.012);
				backMesh.castShadow = true;
				backMesh.receiveShadow = true;
				cardMesh.add(backMesh);

				// 4. Compact Arched Top Hanger Tab with Horizontal Clip Slot Hole (matching user photo)
				const archW = caseW * 0.52;
				const archH = 0.14;
				const archShape = new THREE.Shape();
				archShape.moveTo(-archW / 2, 0);
				archShape.lineTo(archW / 2, 0);
				archShape.quadraticCurveTo(archW / 2, archH, 0, archH);
				archShape.quadraticCurveTo(-archW / 2, archH, -archW / 2, 0);

				// Horizontal capsule slot hole for the lanyard clip
				const slotW = 0.26;
				const slotH = 0.06;
				const slotR = 0.025;
				const sx = -slotW / 2;
				const sy = 0.04;
				const clipHole = new THREE.Path();
				clipHole.moveTo(sx + slotR, sy);
				clipHole.lineTo(sx + slotW - slotR, sy);
				clipHole.quadraticCurveTo(sx + slotW, sy, sx + slotW, sy + slotR);
				clipHole.lineTo(sx + slotW, sy + slotH - slotR);
				clipHole.quadraticCurveTo(sx + slotW, sy + slotH, sx + slotW - slotR, sy + slotH);
				clipHole.lineTo(sx + slotR, sy + slotH);
				clipHole.quadraticCurveTo(sx, sy + slotH, sx, sy + slotH - slotR);
				clipHole.lineTo(sx, sy + slotR);
				clipHole.quadraticCurveTo(sx, sy, sx + slotR, sy);
				archShape.holes.push(clipHole);

				const archGeo = new THREE.ExtrudeGeometry(archShape, {
					depth: 0.01,
					bevelEnabled: true,
					bevelSegments: 2,
					steps: 1,
					bevelSize: 0.003,
					bevelThickness: 0.003
				});
				const archMesh = new THREE.Mesh(archGeo, clearCaseMat);
				archMesh.position.set(cc.x, cc.y + caseH / 2 - 0.005, cc.z - 0.005);
				archMesh.castShadow = true;
				cardMesh.add(archMesh);
			}

			model.scale.set(2.75, 2.75, 2.75);

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

<div class="relative w-full h-[460px] sm:h-[520px] md:h-[560px] flex items-center justify-center select-none overflow-visible">
	<div
		bind:this={containerEl}
		class="w-full h-full touch-none {isDragging ? 'cursor-grabbing' : isHovered ? 'cursor-grab' : 'cursor-default'}"
		style="touch-action: none;"
	></div>

	<!-- Sleek Modern Comic Badge Hint -->
	<div
		class="pointer-events-none absolute bottom-2 right-4 sm:bottom-4 sm:right-6 font-mono text-[11px] text-foreground
			flex items-center gap-2 border-2 border-amber-400 bg-card px-3 py-1.5 rounded-lg shadow-[3px_3px_0px_0px_#fbbf24] transition-opacity duration-300"
		class:opacity-20={isDragging}
	>
		<span class="w-2 h-2 rounded-full bg-amber-400"></span>
		<span class="font-bold tracking-wider">[DRAG & TOSS 3D PASS]</span>
	</div>
</div>
