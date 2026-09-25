module.exports = async function validate(context) {
  // Check the not-working directory was created
  const { stdout: dirCheck, exitCode: dirExit } = await context.terminal.runShell(
    'test -d ~/not-working && echo "exists"',
  );
  if (dirExit !== 0 || !dirCheck.includes('exists')) {
    return context.fail(
      '`not-working/` directory not found. Create it with:\n' +
      '`mkdir ~/not-working && cd not-working && zowe config import ~/.zowe/zowe.config.json`',
    );
  }

  // Check a config file was imported into it
  const { stdout: cfgCheck } = await context.terminal.runShell(
    'test -f ~/not-working/zowe.config.json && echo "exists"',
  );
  if (!cfgCheck.includes('exists')) {
    return context.fail(
      '`not-working/zowe.config.json` not found. ' +
      'Run `cd ~/not-working && zowe config import ~/.zowe/zowe.config.json`.',
    );
  }

  // Confirm we're not currently inside not-working (they should have cd'd back)
  const { stdout: pwd } = await context.terminal.run('pwd');
  if (pwd.trim().endsWith('not-working')) {
    return context.warn(
      'You\'re still inside `not-working/`. Navigate back with `cd ..` first, then check again.',
    );
  }

  // Confirm the baseline works from the parent directory
  const { exitCode: listExit } = await context.terminal.runShell(
    'zowe files list ds cust001 2>&1',
  );
  if (listExit !== 0) {
    return context.fail(
      'The baseline Zowe command is failing from the current directory. ' +
      'Make sure you are in the parent of `not-working/` and that `~/.zowe/zowe.config.json` is correct.',
    );
  }

  return context.pass(
    'Multiple config files working correctly! ' +
    'Directory-scoped configs let you switch mainframe connections just by changing folders.',
  );
};
