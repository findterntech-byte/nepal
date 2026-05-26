const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function (file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.json')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(__dirname);
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('रू')) {
        let newContent = content.replace(/रू(?! )/g, 'रू ');
        if (newContent !== content) {
            content = newContent;
            fs.writeFileSync(file, content, 'utf8');
            count++;
            console.log(`Replaced in ${file}`);
        }
    }
});
console.log(`Total files modified: ${count}`);
