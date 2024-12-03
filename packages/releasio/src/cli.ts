#!/usr/bin/env node

import { getCliOptions, getLogUrl, getUnstoredGitLogs, createLog, validateToken } from './utils';

async function main() {
  const { token } = getCliOptions();
  await validateToken(token);
  const unstoredLogs = await getUnstoredGitLogs(token);

  if (unstoredLogs.length === 0) {
    // TODO: add link to view them
    console.log(`[info] all logs are stored already`);
    return;
  }

  const createdLog = await createLog({ token, logs: unstoredLogs });
  console.log(`[info] new log generated: `, getLogUrl(token, createdLog._id));
}

main();
