/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Generates an authentic passport-style sample photo file client-side
 */
export async function createSamplePhotoFile(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 700;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Background: clean off-white / light blue studio background common in Indian exam photos
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 900);
  bgGrad.addColorStop(0, '#e2e8f0');
  bgGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 700, 900);

  // Soft studio light vignette
  const radial = ctx.createRadialGradient(350, 400, 100, 350, 450, 450);
  radial.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  radial.addColorStop(1, 'rgba(200, 210, 225, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 700, 900);

  // Shoulders & Formal Dark Shirt
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(350, 850, 280, 240, 0, 0, Math.PI * 2);
  ctx.fill();

  // Collar
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(310, 640);
  ctx.lineTo(350, 720);
  ctx.lineTo(390, 640);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = '#e2a97e';
  ctx.beginPath();
  ctx.rect(315, 570, 70, 90);
  ctx.fill();

  // Face Oval
  ctx.fillStyle = '#eab68f';
  ctx.beginPath();
  ctx.ellipse(350, 430, 140, 180, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#1c1917';
  ctx.beginPath();
  ctx.arc(350, 370, 145, Math.PI * 0.9, Math.PI * 2.1);
  ctx.fill();

  // Hair styling details
  ctx.beginPath();
  ctx.ellipse(350, 290, 145, 60, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.ellipse(300, 420, 16, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(400, 420, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrows
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(280, 395);
  ctx.quadraticCurveTo(300, 385, 325, 395);
  ctx.moveTo(375, 395);
  ctx.quadraticCurveTo(400, 385, 420, 395);
  ctx.stroke();

  // Nose
  ctx.strokeStyle = '#c68b59';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(350, 420);
  ctx.lineTo(345, 470);
  ctx.lineTo(358, 473);
  ctx.stroke();

  // Gentle Smile
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(350, 495, 30, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  // Add date stamp (common on Indian exam photos like SSC / UPSC)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(100, 830, 500, 45);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('PASSPORT PHOTO SAMPLE', 350, 862);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], 'sample_passport_photo.jpg', { type: 'image/jpeg' }));
      }
    }, 'image/jpeg', 0.95);
  });
}

/**
 * Generates an authentic sample signature file client-side
 */
export async function createSampleSignatureFile(): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 240;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  // Crisp white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 600, 240);

  // Draw natural cursive blue ink signature stroke
  ctx.strokeStyle = '#024b94'; // Indian exam standard blue ballpoint pen ink
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  // Capital letter R
  ctx.moveTo(80, 160);
  ctx.lineTo(95, 60);
  ctx.bezierCurveTo(140, 50, 160, 95, 110, 115);
  ctx.bezierCurveTo(135, 125, 165, 165, 180, 170);

  // Flowing script letters
  ctx.bezierCurveTo(200, 140, 215, 155, 230, 145);
  ctx.bezierCurveTo(245, 125, 260, 160, 275, 145);
  ctx.bezierCurveTo(290, 130, 310, 150, 330, 140);
  ctx.bezierCurveTo(360, 80, 375, 165, 395, 145);
  ctx.bezierCurveTo(420, 130, 440, 155, 465, 140);
  ctx.stroke();

  // Dynamic underline stroke with two dots
  ctx.beginPath();
  ctx.lineWidth = 3.5;
  ctx.moveTo(90, 185);
  ctx.quadraticCurveTo(280, 195, 490, 175);
  ctx.stroke();

  ctx.fillStyle = '#024b94';
  ctx.beginPath();
  ctx.arc(380, 205, 3.5, 0, Math.PI * 2);
  ctx.arc(420, 205, 3.5, 0, Math.PI * 2);
  ctx.fill();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], 'sample_signature.jpg', { type: 'image/jpeg' }));
      }
    }, 'image/jpeg', 0.95);
  });
}
