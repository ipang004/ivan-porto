import * as THREE from 'three';

export function createLanyardStrap(loopApex: THREE.Vector3, loopHalfWidth: number, ribbonWidth: number = 0.105) {
	const strapMat = new THREE.MeshStandardMaterial({
		color: 0x16181d,
		roughness: 0.92,
		metalness: 0.05,
		side: THREE.DoubleSide
	});

	const group = new THREE.Group();

	// Pre-allocated Continuous Ribbon Geometry
	const numSegments = 50;
	const vertexCount = (numSegments + 1) * 2;
	const positions = new Float32Array(vertexCount * 3);
	const normals = new Float32Array(vertexCount * 3);
	const uvs = new Float32Array(vertexCount * 2);
	const indices: number[] = [];

	// Pre-populate static UVs and Indices once
	for (let i = 0; i <= numSegments; i++) {
		const frac = i / numSegments;
		const uvIdx = i * 4;
		uvs[uvIdx] = 0;
		uvs[uvIdx + 1] = frac;
		uvs[uvIdx + 2] = 1;
		uvs[uvIdx + 3] = frac;

		if (i < numSegments) {
			const base = i * 2;
			indices.push(base, base + 1, base + 2);
			indices.push(base + 1, base + 3, base + 2);
		}
	}

	const geom = new THREE.BufferGeometry();
	const posAttr = new THREE.BufferAttribute(positions, 3);
	const normAttr = new THREE.BufferAttribute(normals, 3);
	geom.setAttribute('position', posAttr);
	geom.setAttribute('normal', normAttr);
	geom.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
	geom.setIndex(indices);

	const strapMesh = new THREE.Mesh(geom, strapMat);
	strapMesh.castShadow = true;
	group.add(strapMesh);

	// Pre-allocated Ring Loop folded cleanly inside the metallic clip ring
	const loopGeom = new THREE.TorusGeometry(0.045, 0.02, 12, 24);
	const loopMesh = new THREE.Mesh(loopGeom, strapMat);
	group.add(loopMesh);

	// Reusable vectors to avoid GC in animation loop
	const pLeftTop = new THREE.Vector3(-loopHalfWidth, loopApex.y, loopApex.z);
	const pRightTop = new THREE.Vector3(loopHalfWidth, loopApex.y, loopApex.z);
	const pApex = loopApex.clone();

	const pLeftRing = new THREE.Vector3();
	const pRightRing = new THREE.Vector3();
	const pLeft1 = new THREE.Vector3();
	const pLeft2 = new THREE.Vector3();
	const pRight1 = new THREE.Vector3();
	const pRight2 = new THREE.Vector3();

	const ringOffsetLeft = new THREE.Vector3(-0.032, 0.015, 0);
	const ringOffsetRight = new THREE.Vector3(0.032, 0.015, 0);

	const ringForward = new THREE.Vector3();
	const apexForward = new THREE.Vector3(0, 0.08, 0.99).normalize();
	const forward = new THREE.Vector3();
	const tangent = new THREE.Vector3();
	const crossVec = new THREE.Vector3();
	const ribbonHalfW = ribbonWidth * 0.5;

	// Pre-allocated curve control points array
	const controlPoints = [
		pLeftRing,
		pLeft1,
		pLeft2,
		pLeftTop,
		pApex,
		pRightTop,
		pRight2,
		pRight1,
		pRightRing
	];

	const curve = new THREE.CatmullRomCurve3(controlPoints, false, 'chordal', 0.0);

	function update(clipPos: THREE.Vector3, cardRot: THREE.Euler) {
		// Update loop mesh transform
		loopMesh.position.copy(clipPos);
		loopMesh.rotation.copy(cardRot);

		// Calculate control points directly along gravity tension line
		pLeftRing.copy(ringOffsetLeft).applyEuler(cardRot).add(clipPos);
		pRightRing.copy(ringOffsetRight).applyEuler(cardRot).add(clipPos);

		pLeft1.lerpVectors(pLeftRing, pLeftTop, 0.33);
		pLeft2.lerpVectors(pLeftRing, pLeftTop, 0.67);

		pRight2.lerpVectors(pRightRing, pRightTop, 0.67);
		pRight1.lerpVectors(pRightRing, pRightTop, 0.33);

		// Update curve points
		curve.points = controlPoints;

		ringForward.set(0, 0, 1).applyEuler(cardRot).normalize();

		const posArr = posAttr.array as Float32Array;
		const normArr = normAttr.array as Float32Array;

		// Evaluate curve and update ribbon mesh vertices directly in buffer
		for (let i = 0; i <= numSegments; i++) {
			const frac = i / numSegments;
			const pt = curve.getPoint(frac);
			curve.getTangent(frac, tangent).normalize();

			const distFromApex = Math.abs(frac - 0.5) * 2;
			forward.lerpVectors(apexForward, ringForward, distFromApex).normalize();
			crossVec.crossVectors(tangent, forward).normalize();

			const idx = i * 6;

			// Vertex 1 (Left edge)
			posArr[idx] = pt.x + crossVec.x * ribbonHalfW;
			posArr[idx + 1] = pt.y + crossVec.y * ribbonHalfW;
			posArr[idx + 2] = pt.z + crossVec.z * ribbonHalfW;

			normArr[idx] = forward.x;
			normArr[idx + 1] = forward.y;
			normArr[idx + 2] = forward.z;

			// Vertex 2 (Right edge)
			posArr[idx + 3] = pt.x - crossVec.x * ribbonHalfW;
			posArr[idx + 4] = pt.y - crossVec.y * ribbonHalfW;
			posArr[idx + 5] = pt.z - crossVec.z * ribbonHalfW;

			normArr[idx + 3] = forward.x;
			normArr[idx + 4] = forward.y;
			normArr[idx + 5] = forward.z;
		}

		posAttr.needsUpdate = true;
		normAttr.needsUpdate = true;
	}

	return {
		group,
		update,
		dispose: () => {
			geom.dispose();
			loopGeom.dispose();
			strapMat.dispose();
		}
	};
}
