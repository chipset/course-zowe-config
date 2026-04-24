# Inspect and Diagnose Configuration

When things aren't working as expected, Zowe CLI has several commands to show you exactly which config files are active and what values they're contributing.

## Which config files is Zowe using?

```
zowe config profiles --show-inputs-only
```

This lists all configuration files Zowe found, in order of precedence, from the current directory. Example output:

```
locations:
  - /home/developer/project/not-working/zowe.config.user.json
  - /home/developer/project/not-working/zowe.config.json
  - /home/developer/.zowe/zowe.config.json
```

## What are the resolved values?

```
zowe config list
```

Shows the merged configuration — what Zowe would actually use for a command run from the current directory.

## Where does each value come from?

```
zowe config list --locations
```

Same output, but annotated with which config file each value came from. Essential for tracking down why a value isn't what you expect.

## Full environment diagnostic

```
zowe config report-env
```

Comprehensive diagnostic output: Zowe version, Node.js version, OS info, all `ZOWE_OPT_*` environment variables, and all active config files. Use this when filing a bug or asking for help.

## Try it with an environment variable

Set a test variable and confirm it appears in the report:

```
export ZOWE_OPT_NAME=yourname
zowe config report-env
```

Look for `ZOWE_OPT_NAME` in the output. When you're done:

```
unset ZOWE_OPT_NAME
```

## Summary: the full precedence order

```
CLI flags
    ↓
Environment variables (ZOWE_OPT_*)
    ↓
zowe.config.user.json  (current directory)
    ↓
zowe.config.json       (current directory)
    ↓
zowe.config.user.json  (parent directory)
    ↓
zowe.config.json       (parent directory)
    ↓  ... (walks up until ~/.zowe)
    ↓
~/.zowe/zowe.config.json  (global fallback)
```

Run at least `zowe config list` and `zowe config report-env`, then click **Check Work** to complete the course!
