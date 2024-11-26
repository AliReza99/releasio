import { $ } from 'execa';
import { GitLog, LogPayload } from '../types';
import { getLogs } from './requests';

const GIT_LOGS_COUNT = 200;

export async function getGitLogs(count: number) {
  return (await $`git log -n ${count} --format=%s|||%an|||%cd|||%H`).stdout
    .trim()
    .split('\n')
    .map(line => {
      const parts = line.split('|||');
      const gitLog: GitLog = {
        message: parts[0],
        author: parts[1],
        date: parts[2],
        commit: parts[3],
      };
      return gitLog;
    });
}

export function gitLogsToLogPayload(gitLogs: GitLog[]) {
  const lastCommitSha = gitLogs[0].commit;

  return gitLogs.reduce(
    (pre, current) => {
      pre.changes.push(`#${current.message}`);
      return pre;
    },
    {
      version: null,
      changes: [],
      commit: lastCommitSha,
    } as LogPayload,
  );
}

export async function getUnstoredGitLogs(token: string) {
  const storedLogs = await getLogs(token);
  const gitLogs = await getGitLogs(GIT_LOGS_COUNT);

  if (storedLogs.length === 0) {
    return gitLogs;
  }

  const lastStoredCommitSha = storedLogs[0].commit;
  const lastStoredLogIndex = gitLogs.findIndex(l => l.commit === lastStoredCommitSha);
  return gitLogs.slice(0, lastStoredLogIndex);
}
