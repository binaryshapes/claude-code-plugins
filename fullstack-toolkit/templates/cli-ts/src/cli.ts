import { Command } from 'commander';
import { hello } from './commands/hello';

export const cli = new Command()
  .name('{{bin}}')
  .description('{{name}} CLI tool')
  .version('0.0.0');

// Register commands
cli.addCommand(hello);
