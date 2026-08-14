const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'recursos visuales', '15 diapositivas');
const destDir = path.join(__dirname, 'public', 'images', 'slides');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png')).sort();
console.log(`Encontradas ${files.length} imágenes en ${srcDir}`);

files.forEach((file, index) => {
  const slideNum = index + 1;
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, `slide_${slideNum}.png`);
  fs.copyFileSync(srcFile, destFile);
  console.log(`Copiado: ${file} -> /images/slides/slide_${slideNum}.png (${fs.statSync(destFile).size} bytes)`);
});

console.log('¡Las 15 imágenes fueron copiadas exitosamente!');
