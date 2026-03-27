import re
import sys

INFILE = r"c:\dump\nepal_backup.sql"
OUTFILE = r"c:\dump\nepal_backup_converted.sql"

pattern = re.compile(r"^COPY\s+(\S+)\s*\((.*?)\)\s*FROM\s+stdin;", re.IGNORECASE)

blocks_converted = 0
rows_converted = 0

def escape_sql(f):
    # f is a raw field from COPY (where NULL is represented as \N)
    if f == r"\\N":
        return 'NULL'
    # escape single quotes by doubling, and backslashes by doubling
    s = f.replace("'", "''").replace('\\', '\\\\')
    return "'" + s + "'"

with open(INFILE, 'r', encoding='utf-8', errors='replace') as fin, open(OUTFILE, 'w', encoding='utf-8') as fout:
    lines = fin.readlines()
    i = 0
    while i < len(lines):
        m = pattern.match(lines[i])
        if m:
            table = m.group(1)
            cols = [c.strip() for c in m.group(2).split(',')]
            blocks_converted += 1
            fout.write(f"-- Converted COPY block for {table}\n")
            fout.write(f"-- Original: {lines[i]}")
            i += 1
            # Read data lines until a line that is exactly "\\." (possibly with CRLF)
            while i < len(lines) and lines[i].strip() != r"\\.":
                data_line = lines[i].rstrip('\r\n')
                if data_line == '':
                    i += 1
                    continue
                fields = data_line.split('\t')
                # If number of fields differs from columns, emit a comment and skip
                if len(fields) != len(cols):
                    fout.write(f"-- SKIP malformed COPY line (cols {len(cols)} != fields {len(fields)}): {data_line}\n")
                    i += 1
                    continue
                vals = [escape_sql(f) for f in fields]
                fout.write(f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({', '.join(vals)});\n")
                rows_converted += 1
                i += 1
            # skip the '\\.' terminator line(s)
            while i < len(lines) and lines[i].strip() == r"\\.":
                i += 1
            fout.write('\n')
        else:
            fout.write(lines[i])
            i += 1

print(f"Done. Blocks converted: {blocks_converted}, rows converted: {rows_converted}.")
