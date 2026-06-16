import { chromium } from 'playwright'
import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join } from 'path'

const targets = [
  {
    name: 'stock',
    url: 'https://stock-ecommerce.onrender.com/',
    renderWarmup: true,
    waitForSelector: '.hero-wrap',
    extraWait: 4000,
    position: 'top',
  },
  {
    name: 'space-cloud',
    url: 'https://space-cloud-drive.vercel.app/',
    renderWarmup: false,
    waitForSelector: 'h1',
    extraWait: 2000,
    position: 'top',
  },
  {
    name: 'lark',
    url: 'https://lark-social-media.onrender.com/',
    renderWarmup: true,
    waitForSelector: '.lark-login-root',
    extraWait: 3000,
    position: 'top',
  },
  {
    name: 'loruki',
    url: 'https://loruki-website-alpha.vercel.app/',
    renderWarmup: false,
    waitForSelector: '.navbar',
    extraWait: 1000,
    position: 'top',
  },
  {
    name: 'expense-tracker',
    url: 'https://expense-tracker-six-olive.vercel.app/',
    renderWarmup: false,
    waitForSelector: '.container',
    extraWait: 1000,
    position: 'top',
  },
  {
    name: 'weather',
    url: 'https://weather-app-navy-sigma-27.vercel.app/',
    renderWarmup: false,
    waitForSelector: '.card',
    extraWait: 1000,
    position: 'centre',
  },
]

const OUT_W = 1280
const OUT_H = 720
const sleep = ms => new Promise(r => setTimeout(r, ms))

const outDir = join(process.cwd(), 'public', 'previews')
mkdirSync(outDir, { recursive: true })

async function httpPing(url, maxMs = 240000) {
  const start = Date.now()
  let attempt = 0
  while (Date.now() - start < maxMs) {
    attempt++
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      console.log(`   ping ${attempt}: HTTP ${res.status}`)
      if (res.status === 200) return true
    } catch {
      console.log(`   ping ${attempt}: no response yet`)
    }
    await sleep(6000)
  }
  return false
}

async function captureRenderApp(page, url, selector) {
  console.log(`   phase 1 — HTTP ping until 200 (max 4 min)...`)
  const alive = await httpPing(url)
  if (!alive) return false

  console.log(`   server alive — stabilizing 3s...`)
  await sleep(3000)

  console.log(`   phase 2 — browser load (networkidle)...`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForSelector(selector, { timeout: 15000 })
  return true
}

const browser = await chromium.launch()

for (const target of targets) {
  const { name, url, renderWarmup, waitForSelector: selector, extraWait, position } = target
  console.log(`\n-> ${name}: ${url}`)

  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

  try {
    if (renderWarmup) {
      const ready = await captureRenderApp(page, url, selector)
      if (!ready) {
        console.error(`   SKIPPED: server did not respond in time`)
        await page.close()
        continue
      }
      console.log(`   "${selector}" found`)
    } else {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
      await page.waitForSelector(selector, { timeout: 15000 })
      console.log(`   "${selector}" found`)
    }

    await page.waitForTimeout(extraWait)

    const buffer = await page.screenshot({ fullPage: false })

    await sharp(buffer)
      .resize(OUT_W, OUT_H, { fit: 'cover', position })
      .webp({ quality: 82 })
      .toFile(join(outDir, `${name}.webp`))

    console.log(`   saved ${name}.webp`)
  } catch (err) {
    console.error(`   failed: ${err.message}`)
  }

  await page.close()
}

await browser.close()
console.log('\nDone.')