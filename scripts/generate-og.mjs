import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { Resvg } from '@resvg/resvg-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const svg = readFileSync(join(root, 'src/og/default.svg'), 'utf-8');

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 },
  font: {
    loadSystemFonts: true,
  },
});

const png = resvg.render().asPng();

mkdirSync(join(root, 'public'), { recursive: true });
writeFileSync(join(root, 'public/og-default.png'), png);

console.log('Generated public/og-default.png');
