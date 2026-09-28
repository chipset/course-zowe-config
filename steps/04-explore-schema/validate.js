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

  const { stdout: raw, exitCode: cfgExit } = await context.terminal.runShell('cat ~/.zowe/zowe.config.json');
  if (cfgExit !== 0) {
    return context.fail('Could not read `~/.zowe/zowe.config.json`.');
  }

  let cfg;
  try {
    cfg = JSON.parse(raw);
  } catch {
    return context.fail('`zowe.config.json` is not valid JSON. Check for syntax errors and save the file.');
  }

  if (!cfg.$schema) {
    return context.fail(
      '`$schema` is missing from `zowe.config.json`. It should point at `./zowe.schema.json`.',
    );
  }

  return context.pass(
    'Schema file present, and `zowe.config.json` links to it via `$schema`. ' +
    'Open it with `code ~/.zowe/zowe.schema.json` if you want to explore the available properties.',
  );
};
