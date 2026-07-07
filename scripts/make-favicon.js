const sharp = require('sharp');

async function processIcon() {
  const iconSize = 1024;
  
  const circleSvg = `
    <svg width="${iconSize}" height="${iconSize}">
      <circle cx="${iconSize/2}" cy="${iconSize/2}" r="${iconSize/2}" fill="white" />
    </svg>
  `;

  const original = await sharp('src/app/icon.png')
    .resize({
      width: Math.round(iconSize * 0.65), 
      height: Math.round(iconSize * 0.65),
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 }
    })
    .toBuffer();

  await sharp(Buffer.from(circleSvg))
    .composite([
      { input: original, gravity: 'center' }
    ])
    .png()
    .toFile('src/app/icon.new.png');
    
  console.log("Done");
}

processIcon().catch(console.error);
