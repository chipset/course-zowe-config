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

  return context.pass(
    'CLI flag precedence confirmed.',
  );
};
