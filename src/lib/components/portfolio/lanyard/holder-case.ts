import * as THREE from 'three';

export function buildHolderCase(card: THREE.Mesh, envMap: THREE.Texture) {
	const cardGeo = card.geometry;
	cardGeo.computeBoundingBox();
	const cardBox = cardGeo.boundingBox!;
	const cw = cardBox.max.x - cardBox.min.x;
	const ch = cardBox.max.y - cardBox.min.y;
	const cd = Math.max(cardBox.max.z - cardBox.min.z, 0.02);
	const cc = cardBox.getCenter(new THREE.Vector3());

	// Holder Case dimensions
	const caseW = cw + 0.075;
	const caseH = ch + 0.075;
	const cornerR = 0.045;

	// Materials
	const bumperMat = new THREE.MeshStandardMaterial({
		color: 0x161820,
		roughness: 0.58,
		metalness: 0.28,
		envMap: envMap
	});

	const glassMat = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		transparent: true,
		opacity: 0.15,
		roughness: 0.04,
		metalness: 0.02,
		clearcoat: 1.0,
		clearcoatRoughness: 0.02,
		transmission: 0.98,
		ior: 1.5,
		thickness: 0.025,
		reflectivity: 0.65,
		envMap: envMap,
		depthWrite: false
	});

	const boltMat = new THREE.MeshStandardMaterial({
		color: 0xd1d5db,
		metalness: 0.95,
		roughness: 0.18,
		envMap: envMap
	});

	// 1. Front Heavy-Duty Bumper Frame with Window Opening
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

	// Window cutout opening
	const winW = cw * 0.96;
	const winH = ch * 0.96;
	const winR = 0.025;
	const wx0 = -winW / 2;
	const wy0 = -winH / 2;

	const winHole = new THREE.Path();
	winHole.moveTo(wx0 + winR, wy0);
	winHole.lineTo(wx0 + winW - winR, wy0);
	winHole.quadraticCurveTo(wx0 + winW, wy0, wx0 + winW, winR + wy0);
	winHole.lineTo(wx0 + winW, wy0 + winH - winR);
	winHole.quadraticCurveTo(wx0 + winW, wy0 + winH, winW - winR + wx0, wy0 + winH);
	winHole.lineTo(wx0 + winR, wy0 + winH);
	winHole.quadraticCurveTo(wx0, wy0 + winH, wx0, wy0 + winH - winR);
	winHole.lineTo(wx0, wy0 + winR);
	winHole.quadraticCurveTo(wx0, wy0, wx0 + winR, wy0);
	frameShape.holes.push(winHole);

	const frameGeo = new THREE.ExtrudeGeometry(frameShape, {
		depth: 0.012,
		bevelEnabled: true,
		bevelSegments: 2,
		steps: 1,
		bevelSize: 0.005,
		bevelThickness: 0.005
	});

	const frontFrameMesh = new THREE.Mesh(frameGeo, bumperMat);
	frontFrameMesh.position.set(cc.x, cc.y, cc.z + cd / 2 + 0.004);
	frontFrameMesh.castShadow = true;
	frontFrameMesh.receiveShadow = true;
	card.add(frontFrameMesh);

	// 2. 4 Precision Metallic Corner Hex Rivets on Bumper Corners
	const boltGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.008, 8);
	const boltOffset = 0.026;
	const boltZ = cc.z + cd / 2 + 0.018;

	const boltPositions = [
		[cc.x - caseW / 2 + boltOffset, cc.y + caseH / 2 - boltOffset],
		[cc.x + caseW / 2 - boltOffset, cc.y + caseH / 2 - boltOffset],
		[cc.x - caseW / 2 + boltOffset, cc.y - caseH / 2 + boltOffset],
		[cc.x + caseW / 2 - boltOffset, cc.y - caseH / 2 + boltOffset]
	];

	boltPositions.forEach(([bx, by]) => {
		const boltMesh = new THREE.Mesh(boltGeo, boltMat);
		boltMesh.rotation.x = Math.PI / 2;
		boltMesh.position.set(bx, by, boltZ);
		boltMesh.castShadow = true;
		card.add(boltMesh);
	});

	// 3. Crystal Clear Protective Front Tempered Glass Window
	const glassGeo = new THREE.PlaneGeometry(winW, winH);
	const glassMesh = new THREE.Mesh(glassGeo, glassMat);
	glassMesh.position.set(cc.x, cc.y, cc.z + cd / 2 + 0.002);
	card.add(glassMesh);

	// 4. Sturdy Back Chassis Plate with Ergonomic Angled Thumb Cutout
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

	const tearW = cw * 0.32;
	const tearH = ch * 0.35;
	const tearY = -0.08;
	const tearHole = new THREE.Path();
	tearHole.moveTo(-tearW / 2, tearY + 0.04);
	tearHole.lineTo(-tearW * 0.4, tearY + tearH);
	tearHole.quadraticCurveTo(0, tearY + tearH + 0.04, tearW * 0.4, tearY + tearH);
	tearHole.lineTo(tearW / 2, tearY + 0.04);
	tearHole.quadraticCurveTo(tearW / 2, tearY, 0, tearY);
	tearHole.quadraticCurveTo(-tearW / 2, tearY, -tearW / 2, tearY + 0.04);
	backShape.holes.push(tearHole);

	const backGeo = new THREE.ExtrudeGeometry(backShape, {
		depth: 0.012,
		bevelEnabled: true,
		bevelSegments: 2,
		steps: 1,
		bevelSize: 0.004,
		bevelThickness: 0.004
	});

	const backMesh = new THREE.Mesh(backGeo, bumperMat);
	backMesh.position.set(cc.x, cc.y, cc.z - cd / 2 - 0.016);
	backMesh.castShadow = true;
	backMesh.receiveShadow = true;
	card.add(backMesh);

	// 5. Solid Integrated Top Hanger Mount with Reinforced Slot Hole
	const archW = caseW * 0.58;
	const archH = 0.15;
	const archShape = new THREE.Shape();
	archShape.moveTo(-archW / 2, 0);
	archShape.lineTo(archW / 2, 0);
	archShape.lineTo(archW * 0.42, archH - 0.03);
	archShape.quadraticCurveTo(0, archH + 0.015, -archW * 0.42, archH - 0.03);
	archShape.lineTo(-archW / 2, 0);

	const slotW = 0.28;
	const slotH = 0.065;
	const slotR = 0.028;
	const sx = -slotW / 2;
	const sy = 0.045;
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
		depth: 0.014,
		bevelEnabled: true,
		bevelSegments: 2,
		steps: 1,
		bevelSize: 0.004,
		bevelThickness: 0.004
	});
	const archMesh = new THREE.Mesh(archGeo, bumperMat);
	archMesh.position.set(cc.x, cc.y + caseH / 2 - 0.005, cc.z - 0.007);
	archMesh.castShadow = true;
	card.add(archMesh);

	const liningShape = new THREE.Shape();
	const loutW = slotW + 0.028;
	const loutH = slotH + 0.028;
	const loutR = slotR + 0.014;
	const lsx = -loutW / 2;
	const lsy = sy - 0.014;
	liningShape.moveTo(lsx + loutR, lsy);
	liningShape.lineTo(lsx + loutW - loutR, lsy);
	liningShape.quadraticCurveTo(lsx + loutW, lsy, lsx + loutW, lsy + loutR);
	liningShape.lineTo(lsx + loutW, lsy + loutH - loutR);
	liningShape.quadraticCurveTo(lsx + loutW, lsy + loutH, lsx + loutW - loutR, lsy + loutH);
	liningShape.lineTo(lsx + loutR, lsy + loutH);
	liningShape.quadraticCurveTo(lsx, lsy + loutH, lsx, lsy + loutH - loutR);
	liningShape.lineTo(lsx, lsy + loutR);
	liningShape.quadraticCurveTo(lsx, lsy, lsx + loutR, lsy);
	liningShape.holes.push(clipHole);

	const liningGeo = new THREE.ExtrudeGeometry(liningShape, {
		depth: 0.016,
		bevelEnabled: true,
		bevelSegments: 1,
		steps: 1,
		bevelSize: 0.002,
		bevelThickness: 0.002
	});
	const liningMesh = new THREE.Mesh(liningGeo, boltMat);
	liningMesh.position.set(cc.x, cc.y + caseH / 2 - 0.005, cc.z - 0.008);
	liningMesh.castShadow = true;
	card.add(liningMesh);

	// White backing plate placed strictly BEHIND the card mesh so the hole looks solid white without obstructing front text
	const backPlatePatch = new THREE.Mesh(
		new THREE.PlaneGeometry(0.08, 0.08),
		new THREE.MeshBasicMaterial({ color: 0xffffff })
	);
	backPlatePatch.position.set(0, 0.9446, 0.0008);
	card.add(backPlatePatch);
}


const result = users
    .filter( user => (user.active && user.age >= 18) || user.role === "admin" )
    .map( user => user.name );