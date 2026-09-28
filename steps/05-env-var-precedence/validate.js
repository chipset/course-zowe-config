module.exports = async function validate(context) {
  // Confirm ZOWE_OPT_REJECT_UNAUTHORIZED is not still set (they should have unset it)
  const { stdout: envCheck } = await context.terminal.runShell(
    'echo "${ZOWE_OPT_REJECT_UNAUTHORIZED:-unset}"',
  );
  if (envCheck.trim() !== 'unset') {
    return context.fail(
      '`ZOWE_OPT_REJECT_UNAUTHORIZED` is still set to `' + envCheck.trim() + '`. ' +
      'Run `unset ZOWE_OPT_REJECT_UNAUTHORIZED` to clear it, then verify the baseline works again.',
    );
  }

  // Confirm the baseline command works (env var was unset correctly)
  const { exitCode: listExit } = await context.terminal.runShell(
    'zowe files list ds "cust001.*" 2>&1',
  );
  if (listExit !== 0) {
    return context.fail(
      'The baseline Zowe command is still failing even after unsetting the variable. ' +
      'Check your `~/.zowe/zowe.config.json` configuration.',
    );
  }

  return context.pass(
    'Environment variable precedence confirmed. The env var overrode the config, and unsetting it restored the original behaviour.',
  );
};
