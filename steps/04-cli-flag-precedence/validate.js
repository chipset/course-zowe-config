module.exports = async function validate(context) {
  // Confirm baseline still works (config is intact)
  const { stdout: listOut, exitCode: listExit } = await context.terminal.runShell(
    'zowe files list ds "cust001.*" 2>&1',
  );

  if (listExit !== 0) {
    return context.fail(
      'The baseline `zowe files list ds "cust001.*"` command is failing. ' +
      'Check that your `~/.zowe/zowe.config.json` is still correctly configured from Step 2.',
    );
  }

  // Check they tried at least one override
  const lastCmd = await context.terminal.lastCommand();
  const triedOverride =
    lastCmd.includes('--password') ||
    lastCmd.includes('--port') ||
    lastCmd.includes('--rejectUnauthorized') ||
    lastCmd.includes('--protocol');

  if (!triedOverride) {
    return context.warn(
      'Baseline works! Now try an override: `zowe files list ds "cust001.*" --password wrong` ' +
      'to see how CLI flags take precedence over the config file.',
    );
  }

  return context.pass(
    'CLI flag precedence confirmed. Flags override config values — ' +
    'and Zowe\'s error messages tell you exactly what went wrong.',
  );
};
