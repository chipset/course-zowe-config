module.exports = async function validate(context) {
  // Confirm zowe config list works
  const { stdout: listOut, exitCode: listExit } = await context.terminal.runShell('zowe config list 2>&1');
  if (listExit !== 0) {
    return context.fail(
      '`zowe config list` failed. Make sure Zowe CLI is installed and a config file exists.',
    );
  }

  if (!listOut.includes('profiles') && !listOut.includes('zosmf')) {
    return context.fail(
      '`zowe config list` ran but returned unexpected output. ' +
      'Make sure `~/.zowe/zowe.config.json` is configured correctly.',
    );
  }

  // Confirm report-env works
  const { stdout: reportOut, exitCode: reportExit } = await context.terminal.runShell(
    'zowe config report-env 2>&1',
  );
  if (reportExit !== 0) {
    return context.warn(
      '`zowe config list` works, but `zowe config report-env` failed. ' +
      'Try running it manually to see the full diagnostic output.',
    );
  }

  // Check ZOWE_OPT_NAME was unset
  const { stdout: envCheck } = await context.terminal.runShell(
    'echo "${ZOWE_OPT_NAME:-unset}"',
  );
  if (envCheck.trim() !== 'unset') {
    return context.warn(
      '`ZOWE_OPT_NAME` is still set. Run `unset ZOWE_OPT_NAME` to clean up, then check again.',
    );
  }

  const lastCmd = await context.terminal.lastCommand();
  const usedInspection =
    lastCmd.includes('config list') ||
    lastCmd.includes('report-env') ||
    lastCmd.includes('show-inputs') ||
    lastCmd.includes('unset');

  if (!usedInspection) {
    return context.warn(
      'Config is set up correctly! Try running `zowe config list --locations` and ' +
      '`zowe config report-env` to explore the diagnostic tools.',
    );
  }

  return context.pass(
    'Course complete! You can now create, configure, layer, and diagnose Zowe CLI configuration files.',
  );
};
