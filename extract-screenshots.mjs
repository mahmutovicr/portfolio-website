import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const html = readFileSync(join(__dirname, 'portfolio-preview__6_.html'), 'utf-8')
const outDir = join(__dirname, 'public', 'previews')

mkdirSync(outDir, { recursive: true })

const names = ['stock', 'space-cloud', 'lark', 'loruki', 'expense-tracker', 'weather']
const re = /src="data:image\/webp;base64,([^"]+)"/g
let m, i = 0

while ((m = re.exec(html)) !== null && i < names.length) {
  writeFileSync(join(outDir, `${names[i]}.webp`), Buffer.from(m[1], 'base64'))
  console.log(`✓ public/previews/${names[i]}.webp`)
  i++
}
console.log(`Done — ${i} screenshots saved.`)