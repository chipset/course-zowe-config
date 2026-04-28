module.exports = async function validate(context) {
  const { exitCode } = await context.terminal.runShell(
    'test -f ~/.zowe/zowe.schema.json && echo "exists"',
  );
  if (exitCode !== 0) {
    return context.fail(
      '`~/.zowe/zowe.schema.json` not found. ' +
      'Run `zowe config update-schemas` to generate it.',
    );
  }

  return context.pass(
    'Schema file present. Open it with `code ~/.zowe/zowe.schema.json` if you want to explore the available properties.',
  );
};
