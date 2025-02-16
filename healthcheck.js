#!/usr/bin/env node
import process from 'node:process';
import os from 'node:os';

const healthcheck = process.env.HEALTHCHECK !== 'false';
process.stdout.write(healthcheck ? 'Healthcheck enabled' : 'Healthcheck disabled');
if (!healthcheck) {
    process.exit(0);
}

const hostname = os.hostname();
const port = process.env.PORT || 8090;

const token = 'RmVXY49YwsRfuBBfiYcWOpq6Py57pfa2x';
const code = `<button type="button">${token}</button>`;
const lang = 'html'
const theme = 'github-dark-dimmed';

fetch(`http://${hostname}:${port}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code, lang, theme }),
})
    .then((response) => response.text())
    .then((response) => {
        if (response.includes(token) && response.includes('shiki shiki-themes github-dark-dimmed')) {
            process.exit(0);
        }
        process.exit(1);
    })
    .catch((err) => {
        process.exit(1);
    });
