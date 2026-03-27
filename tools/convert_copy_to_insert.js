const fs = require('fs');
const path = require('path');

const INFILE = 'c:\\dump\\nepal_backup.sql';
const OUTFILE = 'c:\\dump\\nepal_backup_converted.sql';

const content = fs.readFileSync(INFILE, { encoding: 'utf8' });
const lines = content.split(/\r?\n/);
const copyPattern = /^COPY\s+(\S+)\s*\((.*?)\)\s*FROM\s+stdin;/i;
let i = 0;
let blocks = 0;
let rows = 0;
let outLines = [];

function escapeSql(f) {
  if (f === '\\N') return 'NULL';
  // escape single quote and backslash
  return "'" + f.replace(/'/g, "''").replace(/\\/g, '\\\\') + "'";
}

while (i < lines.length) {
  const m = copyPattern.exec(lines[i]);
  if (m) {
    blocks++;
    const table = m[1];
    const cols = m[2].split(',').map(s => s.trim());
    outLines.push(`-- Converted COPY block for ${table}`);
    outLines.push(`-- Original: ${lines[i]}`);
    i++;
    while (i < lines.length && lines[i].trim() !== '\\.') {
      const dataLine = lines[i];
      if (dataLine === '') { i++; continue; }
      const fields = dataLine.split('\t');
      if (fields.length !== cols.length) {
        outLines.push(`-- SKIP malformed COPY line (cols ${cols.length} != fields ${fields.length}): ${dataLine}`);
        i++; continue;
      }
      const vals = fields.map(escapeSql);
      outLines.push(`INSERT INTO ${table} (${cols.join(', ')}) VALUES (${vals.join(', ')});`);
      rows++;
      i++;
    }
    // skip the terminator
    while (i < lines.length && lines[i].trim() === '\\.') i++;
    outLines.push('');
  } else {
    outLines.push(lines[i]);
    i++;
  }
}

fs.writeFileSync(OUTFILE, outLines.join('\n'), { encoding: 'utf8' });
console.log(`Done. Blocks converted: ${blocks}, rows converted: ${rows}. Output: ${OUTFILE}`);
