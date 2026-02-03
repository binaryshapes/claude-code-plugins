import { Command } from 'commander';
import chalk from 'chalk';

export const hello = new Command('hello')
  .description('Say hello')
  .argument('[name]', 'Name to greet', 'World')
  .option('-l, --loud', 'Shout the greeting')
  .action((name: string, options: { loud?: boolean }) => {
    const greeting = `Hello, ${name}!`;
    console.log(options.loud ? chalk.bold.green(greeting.toUpperCase()) : greeting);
  });
