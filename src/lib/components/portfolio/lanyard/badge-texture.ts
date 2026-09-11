import * as THREE from 'three';

export function createBadgeTexture() {
	const texW = 1376;
	const texH = 1376;
	const cardCanvas = document.createElement('canvas');
	cardCanvas.width = texW;
	cardCanvas.height = texH;
	const ctx = cardCanvas.getContext('2d')!;

	function drawQRMatrix(x: number, y: number, size: number) {
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(x, y, size, size);

		const markerSize = Math.floor(size * 0.28);
		function drawFinder(fx: number, fy: number) {
			ctx.fillStyle = '#111318';
			ctx.fillRect(fx, fy, markerSize, markerSize);
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(fx + 2, fy + 2, markerSize - 4, markerSize - 4);
			ctx.fillStyle = '#111318';
			ctx.fillRect(fx + 5, fy + 5, markerSize - 10, markerSize - 10);
		}
		drawFinder(x + 2, y + 2);
		drawFinder(x + size - markerSize - 2, y + 2);
		drawFinder(x + 2, y + size - markerSize - 2);

		ctx.fillStyle = '#111318';
		const step = 4;
		for (let px = x + 3; px < x + size - 3; px += step) {
			for (let py = y + 3; py < y + size - 3; py += step) {
				if (
					(px < x + markerSize + 4 && py < y + markerSize + 4) ||
					(px > x + size - markerSize - 6 && py < y + markerSize + 4) ||
					(px < x + markerSize + 4 && py > y + size - markerSize - 6)
				) continue;
				if (((px * 13 + py * 17) % 7) < 3) {
					ctx.fillRect(px, py, step - 1, step - 1);
				}
			}
		}
	}

	function render(avatarImg?: HTMLImageElement) {
		ctx.fillStyle = '#0a0b10';
		ctx.fillRect(0, 0, texW, texH);

		const frontW = 688;
		const maxH = 1042;

		// =========================================================================
		// 1. FRONT FACE: Clean Standard Corporate White ID Card
		// =========================================================================
		const bgGrad = ctx.createLinearGradient(0, 0, 0, maxH);
		bgGrad.addColorStop(0, '#ffffff');
		bgGrad.addColorStop(0.6, '#fbfcfe');
		bgGrad.addColorStop(1, '#f1f5f9');
		ctx.fillStyle = bgGrad;
		ctx.fillRect(0, 0, frontW, maxH);

		// Clean card border
		ctx.strokeStyle = '#cbd5e1';
		ctx.lineWidth = 3;
		ctx.strokeRect(18, 18, frontW - 36, maxH - 36);

		// --- TOP: Company Name (Header) ---
		const headerY = 32;
		ctx.fillStyle = '#0f172a';
		ctx.font = '900 25px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('PT YAPINDO JAYA ABADI', frontW / 2, headerY + 22);

		// Slim accent line under company name
		const lineGrad = ctx.createLinearGradient(60, headerY + 36, frontW - 60, headerY + 36);
		lineGrad.addColorStop(0, 'rgba(2, 132, 199, 0.1)');
		lineGrad.addColorStop(0.5, 'rgba(2, 132, 199, 0.85)');
		lineGrad.addColorStop(1, 'rgba(2, 132, 199, 0.1)');
		ctx.strokeStyle = lineGrad;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(60, headerY + 36);
		ctx.lineTo(frontW - 60, headerY + 36);
		ctx.stroke();

		// --- PHOTO: High-res portrait ---
		const photoW = 380;
		const photoH = 440;
		const photoX = (frontW - photoW) / 2;
		const photoY = 126;

		// Soft photo drop shadow
		ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
		ctx.beginPath();
		ctx.roundRect(photoX + 4, photoY + 5, photoW, photoH, 16);
		ctx.fill();

		// Photo background placeholder
		ctx.fillStyle = '#e2e8f0';
		ctx.beginPath();
		ctx.roundRect(photoX, photoY, photoW, photoH, 16);
		ctx.fill();

		if (avatarImg) {
			ctx.save();
			ctx.beginPath();
			ctx.roundRect(photoX, photoY, photoW, photoH, 16);
			ctx.clip();
			ctx.drawImage(avatarImg, photoX, photoY, photoW, photoH);
			ctx.restore();
		}

		// Clean photo border
		ctx.strokeStyle = '#94a3b8';
		ctx.lineWidth = 2.5;
		ctx.beginPath();
		ctx.roundRect(photoX, photoY, photoW, photoH, 16);
		ctx.stroke();

		// --- EMPLOYEE IDENTITY: Nama & Posisi ---
		const nameY = 636;
		ctx.fillStyle = '#0f172a';
		ctx.font = '900 46px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('IVAN MALDINI', frontW / 2, nameY);

		// Position / Jabatan (Clean pill badge)
		const pillW = 320;
		const pillH = 40;
		const pillX = (frontW - pillW) / 2;
		const pillY = nameY + 18;

		ctx.fillStyle = '#f0f9ff';
		ctx.beginPath();
		ctx.roundRect(pillX, pillY, pillW, pillH, 20);
		ctx.fill();

		ctx.strokeStyle = '#0284c7';
		ctx.lineWidth = 1.8;
		ctx.stroke();

		ctx.fillStyle = '#0369a1';
		ctx.font = '800 19px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.fillText('FRONTEND DEVELOPER', frontW / 2, pillY + 26);

		// --- STANDARD BARCODE (Umum pada ID Card Perusahaan) ---
		const barPanelY = 768;
		const barPanelH = 88;
		const barPanelW = frontW - 96;
		const barPanelX = 48;

		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.roundRect(barPanelX, barPanelY, barPanelW, barPanelH, 8);
		ctx.fill();

		ctx.strokeStyle = '#cbd5e1';
		ctx.lineWidth = 1.5;
		ctx.stroke();

		ctx.fillStyle = '#0f172a';
		const barWidths = [4, 9, 3, 12, 4, 8, 11, 3, 14, 5, 8, 4, 11, 6, 3, 13, 5, 9, 4, 14, 5, 7, 11, 4, 8, 10, 3, 8, 5, 12];
		let curBx = barPanelX + 28;
		for (let i = 0; i < 48; i++) {
			const bw = barWidths[i % barWidths.length];
			ctx.fillRect(curBx, barPanelY + 12, bw, 46);
			curBx += bw + 5;
			if (curBx > barPanelX + barPanelW - 32) break;
		}

		// Clean barcode caption
		ctx.fillStyle = '#475569';
		ctx.font = '800 13px monospace';
		ctx.textAlign = 'center';
		ctx.fillText('* YJA-2026-IVAN-MALDINI *', frontW / 2, barPanelY + 74);

		// Bottom company tag
		ctx.fillStyle = '#64748b';
		ctx.font = '700 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('PT YAPINDO JAYA ABADI', frontW / 2, 908);

		// =========================================================================
		// 2. BACK FACE: Clean Standard Corporate White Back
		// =========================================================================
		const backX = frontW;

		ctx.fillStyle = '#f8fafc';
		ctx.fillRect(backX, 0, frontW, maxH);

		ctx.strokeStyle = '#cbd5e1';
		ctx.lineWidth = 2.5;
		ctx.strokeRect(backX + 18, 18, frontW - 36, maxH - 36);

		// Black Magnetic Stripe
		ctx.fillStyle = '#0f172a';
		ctx.fillRect(backX + 24, 44, frontW - 48, 76);
		ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
		ctx.fillRect(backX + 24, 54, frontW - 48, 8);
		ctx.fillRect(backX + 24, 100, frontW - 48, 6);

		// Company Name on Back
		const backHeaderY = 170;
		ctx.fillStyle = '#0f172a';
		ctx.font = '900 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('PT YAPINDO JAYA ABADI', backX + frontW / 2, backHeaderY);

		// Clean Card Details Card
		const infoBoxY = 216;
		const infoBoxW = frontW - 80;
		const infoBoxH = 180;
		const infoBoxX = backX + 40;

		ctx.fillStyle = '#ffffff';
		ctx.beginPath();
		ctx.roundRect(infoBoxX, infoBoxY, infoBoxW, infoBoxH, 10);
		ctx.fill();

		ctx.strokeStyle = '#cbd5e1';
		ctx.lineWidth = 1.5;
		ctx.stroke();

		ctx.textAlign = 'left';
		ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.fillStyle = '#64748b';
		ctx.fillText('Nama', infoBoxX + 28, infoBoxY + 52);
		ctx.fillText('Posisi', infoBoxX + 28, infoBoxY + 98);
		ctx.fillText('Perusahaan', infoBoxX + 28, infoBoxY + 144);

		ctx.fillStyle = '#0f172a';
		ctx.font = '900 17px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.fillText(':  IVAN MALDINI', infoBoxX + 150, infoBoxY + 52);
		ctx.fillText(':  FRONTEND DEVELOPER', infoBoxX + 150, infoBoxY + 98);
		ctx.fillText(':  PT YAPINDO JAYA ABADI', infoBoxX + 150, infoBoxY + 144);

		// Official Notice
		const noticeY = 440;
		ctx.fillStyle = '#64748b';
		ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('Kartu ini merupakan tanda pengenal resmi PT Yapindo Jaya Abadi.', backX + frontW / 2, noticeY);
		ctx.fillText('Jika menemukan kartu ini, harap hubungi kantor perusahaan.', backX + frontW / 2, noticeY + 24);

		// QR Code
		const backQrY = 530;
		drawQRMatrix(backX + (frontW - 120) / 2, backQrY, 120);

		ctx.fillStyle = '#475569';
		ctx.font = '800 13px monospace';
		ctx.textAlign = 'center';
		ctx.fillText('PT YAPINDO JAYA ABADI', backX + frontW / 2, backQrY + 154);
	}

	render();

	const texture = new THREE.CanvasTexture(cardCanvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	texture.flipY = false;

	return {
		texture,
		updateAvatar: (avatarImg: HTMLImageElement) => {
			render(avatarImg);
			texture.needsUpdate = true;
		},
		dispose: () => {
			texture.dispose();
		}
	};
}
