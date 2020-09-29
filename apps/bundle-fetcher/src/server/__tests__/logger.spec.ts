import { promises as fs } from 'fs';
import { join } from 'path';

import { logger } from '../logger';

test('saves logs to the expected location', async () => {
  logger.debug('TESTING_LOGS');
  const logFile = join(__dirname, '../../.tmp/logs.txt');

  await expect(fs.readFile(logFile)).resolves.toInclude('TESTING_LOGS');
});
