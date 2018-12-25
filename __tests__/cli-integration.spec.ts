import { system } from 'gluegun';
import { resolve } from 'path';

const src = resolve(__dirname, '..');

const cli = async (cmd: string) =>
  system.run('node ' + resolve(src, 'bin', 'owl') + ` ${cmd}`);

it('outputs version', async () => {
  const output = await cli('--version');
  expect(output).toContain('0.0.1');
});

it('outputs help', async () => {
  const output = await cli('--help');
  expect(output).toContain('0.0.1');
});
