module.exports = async function validate(context) {
  const { stdout: raw, exitCode } = await context.terminal.run('cat ~/.zowe/zowe.config.json');
  if (exitCode !== 0) {
    return context.fail('Could not read `~/.zowe/zowe.config.json`. Make sure it was created in Step 1.');
  }

  let cfg;
  try {
    cfg = JSON.parse(raw);
  } catch {
    return context.fail('`zowe.config.json` is not valid JSON. Check for syntax errors and save the file.');
  }

  const base = cfg?.profiles?.global_base?.properties ?? {};
  const zosmf = cfg?.profiles?.zosmf?.properties ?? {};

  const problems = [];

  if (!base.host || base.host === '') {
    problems.push('`global_base.properties.host` is not set. Add the mainframe IP address.');
  }

  if (base.rejectUnauthorized !== false) {
    problems.push('`global_base.properties.rejectUnauthorized` should be `false` for this environment.');
  }

  if (!base.user || !base.password) {
    problems.push(
      '`global_base.properties.user` and `password` should be set (use `$ZOWE_OPT_USER` / `$ZOWE_OPT_PASSWORD`).',
    );
  }

  const secureFields = cfg?.profiles?.global_base?.secure ?? [];
  if (secureFields.includes('user') || secureFields.includes('password')) {
    problems.push(
      'Move `user` and `password` out of `secure[]` into `properties` (as env var references) and set `secure` to `[]`.',
    );
  }

  if (zosmf.port !== 10443) {
    problems.push(`\`zosmf.properties.port\` should be 10443, but is ${zosmf.port ?? 'not set'}.`);
  }

  if (problems.length > 0) {
    return context.fail('Fix the following in `~/.zowe/zowe.config.json`:\n• ' + problems.join('\n• '));
  }

  return context.pass('`global_base` and `zosmf` configured correctly!');
};
