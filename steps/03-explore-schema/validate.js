module.exports = async function validate(context) {
  const { exitCode } = await context.terminal.run(
    'test -f ~/.zowe/zowe.schema.json && echo "exists"',
  );
  if (exitCode !== 0) {
    return context.fail(
      '`~/.zowe/zowe.schema.json` not found. ' +
      'Run `zowe config update-schemas` to generate it.',
    );
  }

  const lastCmd = await context.terminal.lastCommand();
  const openedSchema = lastCmd.includes('zowe.schema.json') || lastCmd.includes('update-schemas');

  if (!openedSchema) {
    return context.warn(
      'Schema file exists! Open it with `code ~/.zowe/zowe.schema.json` to explore its contents, then check again.',
    );
  }

  return context.pass(
    'Schema file present and explored. It will automatically update when you install new Zowe plugins.',
  );
};
