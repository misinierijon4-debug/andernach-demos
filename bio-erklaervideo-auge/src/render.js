// Rendert video.html Bild für Bild mit Chromium und kodiert mit ffmpeg.
//   node render.js chunk <startFrame> <endFrame> <out.mp4>
//   node render.js stills <outDir> <sek> [sek ...]
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const FPS = 30;

async function openPage() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'warning') console.warn(m.text()); });
  page.on('pageerror', e => { console.error('Seitenfehler:', e.message); process.exit(1); });
  await page.goto('file://' + path.join(__dirname, 'video.html'));
  await page.waitForFunction(() => window.READY === true);
  return { browser, page };
}

async function chunk(start, end, out) {
  const { browser, page } = await openPage();
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg ' + c)))));
  for (let f = start; f < end; f++) {
    await page.evaluate(t => window.renderAt(t), f / FPS);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - start) % 300 === 0) console.log(`[${path.basename(out)}] ${f - start}/${end - start}`);
  }
  ff.stdin.end();
  await done;
  await browser.close();
}

async function stills(dir, times) {
  fs.mkdirSync(dir, { recursive: true });
  const { browser, page } = await openPage();
  for (const t of times) {
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path: path.join(dir, `t${String(t).padStart(6, '0')}.png`) });
  }
  await browser.close();
}

(async () => {
  const [mode, ...a] = process.argv.slice(2);
  if (mode === 'chunk') await chunk(+a[0], +a[1], a[2]);
  else if (mode === 'stills') await stills(a[0], a.slice(1).map(Number));
  else throw new Error('Modus: chunk | stills');
})().catch(e => { console.error(e); process.exit(1); });
