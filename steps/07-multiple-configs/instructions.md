# Working with Multiple Config Files

Zowe CLI walks **up the directory tree** to find configuration files. The first file it finds takes precedence over files higher up. This lets you have per-project configs that automatically activate when you `cd` into the right folder.

## Config file types

| Type | Location | Used for |
|---|---|---|
| **Global** | `~/.zowe/zowe.config.json` | Fallback for all projects |
| **Project** | Any directory | Project-specific overrides |
| **User** | Same directory as project config, named `zowe.config.user.json` | Per-user overrides on top of the project config |

## Step 1 — Create a project config in a subdirectory

```
mkdir not-working
cd not-working
zowe config import ~/.zowe/zowe.config.json
ls -la
```

This creates a `zowe.config.json` in `not-working/` copied from your global config.

## Step 2 — Break it intentionally

Open the new file:

```
code zowe.config.json
```

Find `"rejectUnauthorized": false` and change it to `"rejectUnauthorized": true`. Save the file.

Now run:

```
zowe files list ds cust001
```

It should fail with a certificate error — the project config overrides the global.

## Step 3 — See the config switch in action

Navigate back to the parent directory:

```
cd ..
zowe files list ds cust001
```

It works again. Zowe is now using the global `~/.zowe/zowe.config.json` because there's no config in this directory.

Go back into `not-working` and it breaks again — same command, different directory, different config.

## Step 4 — Create a user config override

While still in `not-working/`, create a user config that overrides the broken project config:

```
zowe config import --uc ~/.zowe/zowe.config.json
ls -la
```

`zowe.config.user.json` overlays values on top of `zowe.config.json` in the same directory. Since your global config has `"rejectUnauthorized": false`, the user config overrides the broken project config:

```
zowe files list ds cust001
```

It should work again.

## Step 5 — Observe the layering

Delete the user config and confirm the error returns:

```
rm zowe.config.user.json
zowe files list ds cust001
```

Then go back to the parent directory and click **Check Work**.

```
cd ..
```
