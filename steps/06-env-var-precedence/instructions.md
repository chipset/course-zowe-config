# Override Config with Environment Variables

Environment variables sit between CLI flags and config files in the precedence order:

```
CLI flags  >  environment variables  >  project config  >  global config
```

Any `zowe.config.json` property can be overridden by an environment variable named `ZOWE_OPT_<PROPERTY_NAME>` (uppercase, with underscores replacing camelCase boundaries).

## Test 1 — Confirm the baseline still works

```
zowe files list ds "cust001.*"
```

## Test 2 — Override rejectUnauthorized via environment variable

```
export ZOWE_OPT_REJECT_UNAUTHORIZED=true
zowe files list ds "cust001.*"
```

Your `zowe.config.json` has `"rejectUnauthorized": false`, but the environment variable overrides it to `true`. The command should fail with a certificate error — the self-signed mainframe certificate is now being rejected.

This is the same mechanism used to inject credentials without storing them in config files:

```
export ZOWE_OPT_USER=myuser
export ZOWE_OPT_PASSWORD=mypassword
```

## Step 3 — Reset the variable

Environment variables persist for the lifetime of the shell session. Unset it to restore normal behaviour:

```
unset ZOWE_OPT_REJECT_UNAUTHORIZED
zowe files list ds "cust001.*"
```

The command should succeed again, proving the config file value is back in control.

Click **Check Work** when done.
