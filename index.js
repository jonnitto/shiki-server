#!/usr/bin/env node

import { createServer } from 'node:http';
import process from 'node:process';
import os from 'node:os';
import { highlight, languageKeys, themeKeys} from './highlight/index.js';

const hostname = os.hostname();
const port = process.env.PORT || 8090;

const opts = {
  defaultTheme: process.env.DEFAULT_THEME || 'vitesse-dark',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'javascript',
}

const charsetOpts = {
  write: process.env.CHARSET || 'utf8',
  contentType: process.env.DEFAULT_RESPONSE_CONTENT_TYPE || 'application/json; charset=utf-8'
}

const server = createServer((req, res) => {
  res.setHeader('Content-Type', charsetOpts.contentType);

  // ensure content type is set
  if (!req.headers['content-type'] || !req.headers['content-type'].includes('application/json')) {
    res.statusCode = 500;
    res.end('❌ Content-Type must be set to application/json')
    return;
  }

  // enable cors
  if (process.env.CORS) {
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS)
    res.setHeader('Access-Control-Allow-Headers', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Max-Age', '-1')
  }

  const bodyStream = [];

  req
    .on('data', (chunk) => {
      bodyStream.push(chunk);
    })
    .on('end', async () => {
      const bufferData = Buffer.concat(bodyStream);
      let errorMessage = '';

      try {
        const data = JSON.parse(bufferData);

        let errorMessages = [];
        let supportedMessages = [];
        let errorTheme = false;

        if (data.lang === undefined) {
          data.lang = opts.defaultLanguage;
        }

        if (data.theme === undefined) {
          data.theme = opts.defaultTheme;
        }

        if (data.code === undefined) {
          errorMessages.push('\n❌ You must provide a code key with the code content');
        }

        if (languageKeys.includes(data.lang) === false) {
          errorMessages.push(`\n❌ The language ${data.lang} is not supported.`);
          supportedMessages.push(`Supported languages are: ${languageKeys.join(', ')}`);
        }

        if (data.theme && themeKeys.includes(data.theme) === false) {
          errorMessages.push(`\n❌ The theme ${data.theme} is not supported.`);
          errorTheme = true;
        }

        if (data.themeDark && themeKeys.includes(data.themeDark) === false) {
          errorMessages.push(`\n❌ The theme ${data.themeDark} is not supported.`);
          errorTheme = true;
        }

        if (errorTheme) {
          supportedMessages.push(`Supported themes are: ${themeKeys.join(', ')}`);
        }

        if (errorMessages.length) {
          res.statusCode = 500;
          res.end(`${errorMessages.join('\n')}\n\n${supportedMessages.join('\n\n')}`);
          return;
        }

        const returnValue = await highlight(data);
        res.end(JSON.stringify(returnValue));
      } catch (ex) {
        res.statusCode = 400;
        const message = generateLogMessage(bufferData, errorMessage, `❌ ${ex.toString()}`);
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${message}Check the log for more details`);
      }
    });
});

server.listen(port, hostname, () => {
  console.log(`✅ Server running at http://${hostname}:${port}/`);
});

let callAmount = 0;
process.on('SIGINT', stopServer);  // CTRL+C
process.on('SIGQUIT', stopServer); // Keyboard quit
process.on('SIGTERM', stopServer); // `kill` command

function generateLogMessage(bufferData, message, title) {
  let logMessage = '';

  console.log('');
  [title, message].filter(Boolean).forEach((text) => {
    const output = `${text}\n\n`;
    logMessage += output;
    console.log(output);
  });
  console.log('Received body');
  console.log(bufferData.toString());
  console.log('');

  return logMessage;
}

function stopServer() {
  if(callAmount < 1) {
    console.log('');
    console.log('🛑 The server has been stopped');
    console.log('');
    setTimeout(() => process.exit(0), 1000);
  }
  callAmount++;
}
