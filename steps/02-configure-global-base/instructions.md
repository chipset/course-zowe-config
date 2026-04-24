# Configure global_base and zosmf

Open the global config file in the editor:

```
code ~/.zowe/zowe.config.json
```

## Understanding global_base

`global_base` is a special **base profile** inside the `profiles` object. Its purpose is to hold shared connection properties — `host`, `port`, `user`, `password` — so you only have to define them once. All other service profiles (zosmf, tso, ssh) inherit from it.

### Update global_base

Find the `global_base` section and replace it with:

```json
"global_base": {
    "type": "base",
    "properties": {
        "host": "10.1.2.123",
        "rejectUnauthorized": false,
        "user": "$ZOWE_OPT_USER",
        "password": "$ZOWE_OPT_PASSWORD"
    },
    "secure": []
}
```

**What each property does:**

| Property | Value | Why |
|---|---|---|
| `host` | `10.1.2.123` | The mainframe IP address |
| `rejectUnauthorized` | `false` | Accept self-signed certificates (workshop only) |
| `user` / `password` | `$ZOWE_OPT_*` | Read from environment variables instead of storing in the file |
| `secure` | `[]` | Empty because credentials are handled via env vars |

## Update the zosmf port

Find the `zosmf` profile and change port `443` to `10443`:

```json
"zosmf": {
    "type": "zosmf",
    "properties": {
        "port": 10443
    },
    "secure": []
}
```

The default z/OSMF port is 443, but this environment uses 10443. Because each service can have a different port, this can't go in `global_base`.

Save the file, then click **Check Work**.
