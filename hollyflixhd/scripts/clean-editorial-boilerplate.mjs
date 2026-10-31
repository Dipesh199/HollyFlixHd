import fs from 'fs';
import path from 'path';

const editorialsDir = path.join(process.cwd(), 'data', 'editorials');

if (!fs.existsSync(editorialsDir)) {
  console.error('Editorials directory not found at:', editorialsDir);
  process.exit(1);
}

const targetKeywords = /(?:4K Ultra HD|Prime Video|Apple TV|4K Blu-ray|Blu-ray|physical collection|physical media)/i;

function cleanText(text) {
  if (!text || typeof text !== 'string') return text;
  
  const paragraphs = text.split(/\n+/);
  const cleanedParagraphs = paragraphs.map(p => {
    // Match sentences ending in ., !, or ? (or end of paragraph)
    const sentences = p.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [p];
    const filtered = sentences.filter(s => !targetKeywords.test(s));
    
    // If all sentences were removed (rare), keep the original to not destroy paragraph
    if (filtered.length === 0) return p.trim();
    
    return filtered.join('').trim();
  }).filter(p => p.length > 0);

  return cleanedParagraphs.join('\n\n');
}

console.log('Reading files from:', editorialsDir);
const files = fs.readdirSync(editorialsDir).filter(f => f.endsWith('.json'));
console.log(`Found ${files.length} JSON files to inspect.`);

let cleanedCount = 0;
let unchangedCount = 0;
let errorCount = 0;

const startTime = Date.now();

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const filePath = path.join(editorialsDir, file);

  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    if (data.editorial && targetKeywords.test(data.editorial)) {
      const original = data.editorial;
      const cleaned = cleanText(original);

      if (cleaned !== original) {
        data.editorial = cleaned;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
        cleanedCount++;
      } else {
        unchangedCount++;
      }
    } else {
      unchangedCount++;
    }
  } catch (err) {
    errorCount++;
    console.error(`Error processing ${file}:`, err.message);
  }

  if ((i + 1) % 1500 === 0 || i === files.length - 1) {
    console.log(`Processed ${i + 1}/${files.length} files... (Cleaned: ${cleanedCount}, Unchanged: ${unchangedCount})`);
  }
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`\nDone in ${elapsed}s!`);
console.log(`- Cleaned: ${cleanedCount}`);
console.log(`- Unchanged: ${unchangedCount}`);
console.log(`- Errors: ${errorCount}`);
