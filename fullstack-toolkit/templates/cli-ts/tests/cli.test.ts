import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';

describe('CLI', () => {
  it('should show help', () => {
    const output = execSync('node dist/index.js --help', {
      encoding: 'utf-8',
    });
    expect(output).toContain('{{name}} CLI tool');
  });

  it('should run hello command', () => {
    const output = execSync('node dist/index.js hello', {
      encoding: 'utf-8',
    });
    expect(output).toContain('Hello, World!');
  });

  it('should greet by name', () => {
    const output = execSync('node dist/index.js hello Claude', {
      encoding: 'utf-8',
    });
    expect(output).toContain('Hello, Claude!');
  });
});
