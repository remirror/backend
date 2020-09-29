import fs from 'fs';
import path from 'path';
import { ILogObject, Logger } from 'tslog';

import { config } from '../config';

const transportPath = path.join(config.tmpdir, 'logs.txt');
const logFileStream = fs.createWriteStream(transportPath);

/**
 * The logger which is used for the project.
 */
export const logger = new Logger({
  name: 'remirror:bundle-fetcher',
  overwriteConsole: true,
  exposeErrorCodeFrame: process.env.NODE_ENV === 'production',
  type: __TEST__ ? 'hidden' : 'pretty',
});

function logToTransport(logObject: ILogObject) {
  logFileStream.write(`${JSON.stringify(logObject)}\n`);
}

logger.attachTransport({
  silly: logToTransport,
  debug: logToTransport,
  trace: logToTransport,
  info: logToTransport,
  warn: logToTransport,
  error: logToTransport,
  fatal: logToTransport,
});

logger.debug(`Logs saved to: ${transportPath}`);
