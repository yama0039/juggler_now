const fs = require('fs');
const code = fs.readFileSync('app.js', 'utf8');
const match = code.match(/const BOOKMARKLET_TEMPLATE = `([\s\S]*?)`;/);
if(match) {
    const template = match[1];
    const minified = template.replace('TARGET_URL', 'http://localhost/').replace(/\n/g, '').replace(/\s{2,}/g, ' ');
    console.log('MINIFIED:', minified);
}
