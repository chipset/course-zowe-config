module.exports = async function validate(context) {
  const { stdout: raw, exitCode } = await context.terminal.runShell('cat ~/.zowe/zowe.config.json');
  if (exitCode !== 0) {
    return context.fail('Could not read `~/.zowe/zowe.config.json`. Make sure it was created in Step 1.');
  }

  let cfg;
  try {
    cfg = JSON.parse(raw);
  } catch {
    return context.fail('`zowe.config.json` is not valid JSON. Check for syntax errors and save the file.');
  }

  const zosmfTest = cfg?.profiles?.zosmf_test;
  if (!zosmfTest) {
    return context.fail(
      '`profiles.zosmf_test` not found. Add a second zosmf profile named `zosmf_test` with `"type": "zosmf"` and `"port": 443`.',
    );
  }

  if (zosmfTest.type !== 'zosmf') {
    return context.fail(`\`zosmf_test.type\` should be "zosmf", but is ${JSON.stringify(zosmfTest.type ?? null)}.`);
  }

  if (zosmfTest.properties?.port !== 443) {
    return context.fail(
      `\`zosmf_test.properties.port\` should be 443, but is ${zosmfTest.properties?.port ?? 'not set'}.`,
    );
  }

  if (cfg?.defaults?.zosmf !== 'zosmf') {
    return context.fail(
      '`defaults.zosmf` should be set back to `"zosmf"`. Did you forget to restore it after testing `zosmf_test`?',
    );
  }

  const { exitCode: listExit } = await context.terminal.runShell('zowe files list ds "cust001.*" 2>&1');
  if (listExit !== 0) {
    return context.fail(
      'The baseline `zowe files list ds "cust001.*"` command is failing. ' +
      'Make sure `defaults.zosmf` is back to `"zosmf"` and `zosmf.properties.port` is still 10443.',
    );
  }

  const { exitCode: explicitExit } = await context.terminal.runShell(
    'zowe files list ds "cust001.*" --zosmf-profile zosmf_test 2>&1',
  );
  if (explicitExit === 0) {
    return context.warn(
      '`--zosmf-profile zosmf_test` succeeded, but it should fail (it points at port 443). ' +
      'Double check `zosmf_test.properties.port` is 443.',
    );
  }

  return context.pass(
    'Named profiles and defaults confirmed! `--<type>-profile` selects a profile for one command, ' +
    'while `defaults` decides which profile is used when no flag is given.',
  );
};
