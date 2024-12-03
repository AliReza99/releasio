import { Command } from 'commander';

const program = new Command();

export function getCliOptions() {
  program.requiredOption('-t, --token <input>', 'Token to use for releasio').parse(process.argv);

  return program.opts<{
    token: string;
  }>();
}
