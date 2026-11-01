import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run build first.');
  process.exit(1);
}

function getAllFiles(dir, exts = ['.html']) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(itemPath, exts));
    } else if (exts.includes(path.extname(item))) {
      results.push(itemPath);
    }
  }
  return results;
}

const htmlFiles = getAllFiles(distDir, ['.html']);
console.log(`Auditing ${htmlFiles.length} generated HTML files in dist/...\n`);

let totalErrors = 0;
let totalCheckedLinks = 0;

function reportError(file, msg) {
  const rel = path.relative(distDir, file);
  console.error(`[ERROR] ${rel}: ${msg}`);
  totalErrors++;
}

// Read index.html IDs for /#anchor checks
const indexHtmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const idRegex = /id=["']([^"']+)["']/g;
const indexIds = new Set();
let idMatch;
while ((idMatch = idRegex.exec(indexHtmlContent)) !== null) {
  indexIds.add(idMatch[1]);
}

for (const filePath of htmlFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract IDs on this page
  const pageIds = new Set();
  const pageIdRegex = /id=["']([^"']+)["']/g;
  let pMatch;
  while ((pMatch = pageIdRegex.exec(content)) !== null) {
    pageIds.add(pMatch[1]);
  }

  // 1. Audit <a> tags
  const hrefRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const href = match[1];
    const text = match[2];
    totalCheckedLinks++;

    // Check for stale linkedin
    if (href.includes('linkedin.com') || text.includes('linkedin.com')) {
      if (href.includes('krishquanta') || text.includes('krishquanta')) {
        reportError(filePath, `Found stale linkedin URL/text containing krishquanta: href="${href}", text="${text.trim()}"`);
      }
      if (href !== 'https://www.linkedin.com/in/mohnish-krishna') {
        reportError(filePath, `LinkedIn href is not exact target URL: "${href}"`);
      }
    }

    // Check mailto
    if (href.startsWith('mailto:')) {
      if (href !== 'mailto:krishquanta+pf@gmail.com') {
        reportError(filePath, `Unexpected email address: "${href}"`);
      }
      continue;
    }

    // Check internal same-page anchor
    if (href.startsWith('#')) {
      const anchor = href.slice(1);
      if (!pageIds.has(anchor)) {
        reportError(filePath, `Same-page anchor "${href}" does not exist on this page`);
      }
      continue;
    }

    // Check home-page anchor /#something
    if (href.startsWith('/#')) {
      const anchor = href.slice(2);
      if (!indexIds.has(anchor)) {
        reportError(filePath, `Home anchor "${href}" target ID "${anchor}" does not exist in index.html`);
      }
      continue;
    }

    // Check absolute local paths
    if (href.startsWith('/')) {
      // Could be file, directory with index.html, or route
      const cleanPath = href.split('?')[0].split('#')[0];
      const localDirectPath = path.join(distDir, cleanPath);
      const localIndexPath = path.join(distDir, cleanPath, 'index.html');

      const exists = fs.existsSync(localDirectPath) || fs.existsSync(localIndexPath);
      if (!exists) {
        reportError(filePath, `Broken internal route/asset link: "${href}"`);
      }
      continue;
    }

    // External links
    if (href.startsWith('http://') || href.startsWith('https://')) {
      // Valid URL
      try {
        new URL(href);
      } catch (e) {
        reportError(filePath, `Malformed external URL: "${href}"`);
      }
      continue;
    }
  }

  // 2. Audit <img> src
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi;
  let imgMatch;
  while ((imgMatch = imgRegex.exec(content)) !== null) {
    const src = imgMatch[1];
    totalCheckedLinks++;
    if (src.startsWith('/')) {
      const localPath = path.join(distDir, src);
      if (!fs.existsSync(localPath)) {
        reportError(filePath, `Broken img src: "${src}"`);
      }
    }
  }

  // 3. Audit <object> data
  const objRegex = /<object\s+[^>]*data=["']([^"']+)["']/gi;
  let objMatch;
  while ((objMatch = objRegex.exec(content)) !== null) {
    const data = objMatch[1];
    totalCheckedLinks++;
    if (data.startsWith('/')) {
      const localPath = path.join(distDir, data);
      if (!fs.existsSync(localPath)) {
        reportError(filePath, `Broken object data: "${data}"`);
      }
    }
  }

  // 4. Audit <link> href (css, favicon, canonical, etc.)
  const linkRegex = /<link\s+[^>]*href=["']([^"']+)["']/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(content)) !== null) {
    const href = linkMatch[1];
    totalCheckedLinks++;
    if (href.startsWith('/#')) {
      const anchor = href.slice(2);
      if (!indexIds.has(anchor)) {
        reportError(filePath, `Home anchor in link tag "${href}" target ID "${anchor}" does not exist in index.html`);
      }
      continue;
    }
    if (href.startsWith('/') && !href.startsWith('//')) {
      const cleanPath = href.split('?')[0].split('#')[0];
      const localDirectPath = path.join(distDir, cleanPath);
      const localIndexPath = path.join(distDir, cleanPath, 'index.html');
      if (!fs.existsSync(localDirectPath) && !fs.existsSync(localIndexPath)) {
        reportError(filePath, `Broken link href: "${href}"`);
      }
    }
  }

  // 5. Audit <script> src
  const scriptRegex = /<script\s+[^>]*src=["']([^"']+)["']/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(content)) !== null) {
    const src = scriptMatch[1];
    totalCheckedLinks++;
    if (src.startsWith('/') && !src.startsWith('//')) {
      const localPath = path.join(distDir, src);
      if (!fs.existsSync(localPath)) {
        reportError(filePath, `Broken script src: "${src}"`);
      }
    }
  }
}

// 6. Audit redirects exist in dist/
const expectedRedirects = ['about', 'skills', 'education', 'learning', 'work', 'contact'];
for (const redir of expectedRedirects) {
  totalCheckedLinks++;
  const redirFile = path.join(distDir, redir, 'index.html');
  if (!fs.existsSync(redirFile)) {
    reportError(redirFile, `Missing expected redirect file for /${redir}`);
  }
}

// 7. Audit public/resume.pdf and dist/resume.pdf directly
console.log('Auditing resume.pdf in public/ and dist/...');
const pdfTargets = [
  path.resolve('public', 'resume.pdf'),
  path.join(distDir, 'resume.pdf')
];
for (const p of pdfTargets) {
  totalCheckedLinks++;
  if (!fs.existsSync(p)) {
    reportError(p, `PDF file does not exist: ${p}`);
    continue;
  }
  const pdfBuffer = fs.readFileSync(p);
  const pdfContent = pdfBuffer.toString('latin1');
  if (pdfContent.includes('linkedin.com/in/krishquanta')) {
    reportError(p, 'PDF still contains linkedin.com/in/krishquanta');
  }
  if (!pdfContent.includes('linkedin.com/in/mohnish-krishna')) {
    reportError(p, 'PDF missing linkedin.com/in/mohnish-krishna');
  }
}

console.log(`\nAudit completed: ${totalCheckedLinks} links, assets, redirects, and PDF streams verified across ${htmlFiles.length} pages.`);
if (totalErrors === 0) {
  console.log('✓ All links, internal routes, anchors, assets, and PDF streams verified successfully with 0 errors!');
  process.exit(0);
} else {
  console.error(`✗ Found ${totalErrors} link error(s).`);
  process.exit(1);
}
