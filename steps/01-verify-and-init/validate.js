module.exports = async function validate(context) {
  // Confirm Zowe CLI is installed
  const { stdout: version, exitCode: versionExit } = await context.terminal.run('zowe --version');
  if (versionExit !== 0) {
    return context.fail('Zowe CLI is not installed or not on PATH. Run `zowe --help` to confirm.');
  }

  // Confirm global config was created
  const { stdout: cfgCheck, exitCode: cfgExit } = await context.terminal.runShell(
    'test -f ~/.zowe/zowe.config.json && echo "exists"',
  );
  if (cfgExit !== 0 || !cfgCheck.includes('exists')) {
    return context.fail(
      '`~/.zowe/zowe.config.json` not found. Run `zowe config init --gc` to create the global config.',
    );
  }

  // Confirm the schema was also created
  const { stdout: schemaCheck } = await context.terminal.runShell(
    'test -f ~/.zowe/zowe.config.schema && echo "exists"',
  );
  if (!schemaCheck.includes('exists')) {
    return context.warn(
      'Global config created, but `zowe.config.schema` is missing. ' +
      'It is usually created automatically — try running `zowe config update-schemas`.',
    );
  }

  return context.pass(`Zowe CLI v${version.trim()} installed and global config created in ~/.zowe.`);
};
