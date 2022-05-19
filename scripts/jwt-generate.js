const crypto = require('crypto');
const fs = require('fs');

function generateSecret() {
    const byte = crypto.randomBytes(32);
    const secret = byte.toString('hex');

    return secret;
}

function runScript() {
    const filePath = '.env';
    let content = fs.readFileSync(filePath, { encoding: 'utf-8' });

    const lines = content.split('\n');
    const secretKeys = ['REFRESH_TOKEN_SECRET=', 'ACCESS_TOKEN_SECRET='];

    for (let i=0; i<lines.length; i++) {
        const line = lines[i];
        const prefix = secretKeys.find((value) => line.startsWith(value));

        if (!prefix) {
            continue;
        }

        const secret = generateSecret();
        lines[i] = `${prefix}${secret}`
    }

    content = lines.join('\n');
    fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
}

runScript();