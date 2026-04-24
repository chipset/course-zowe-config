# Override Config with CLI Flags

Zowe CLI has a strict **order of precedence** for how it resolves configuration values:

```
CLI flags  >  environment variables  >  project config  >  global config
```

CLI flags — options passed directly on the command line — always win. This step explores what happens when you use them to override working values with broken ones.

## Test 1 — Confirm the baseline works

```
zowe files list ds "cust001.*"
```

You should see a list of datasets. This confirms your `zowe.config.json` is correctly configured.

## Test 2 — Override with a wrong password

```
zowe files list ds "cust001.*" --password wrong
```

This overrides the password from `zowe.config.json` with `wrong`. The command should fail with **HTTP 401 Unauthorized**.

Read the error output — Zowe always shows the host, port, resource, and which auth method it attempted. HTTP status codes tell you exactly what went wrong:

| Code | Meaning |
|---|---|
| `401` | Bad credentials |
| `403` | Authenticated but not authorised |
| `404` | Resource not found |
| `ECONNREFUSED` | TCP connection refused (wrong port or host) |

## Test 3 — Override with the wrong port

```
zowe files list ds "cust001.*" --port 443
```

This time you'll get `ECONNREFUSED` — the system is reachable but nothing is listening on port 443. Notice Zowe CLI stops at the first error; fix one issue at a time when troubleshooting.

## Try more (optional)

```
zowe files list ds "cust001.*" --rejectUnauthorized true
zowe files list ds "cust001.*" --protocol http
```

Each produces a different, informative error. Reading these messages is a core Zowe CLI skill.

Click **Check Work** when you've run the override tests.
