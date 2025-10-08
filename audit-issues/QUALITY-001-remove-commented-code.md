# Remove Commented Out Code

## Issue Type
Code Quality / Technical Debt

## Priority
🟡 Low-Medium

## Description
Multiple files contain commented-out code, particularly logging statements, which creates clutter and confusion.

## Locations
1. `app/strelka_ui/services/auth.py:56` - Commented logging warning
2. `app/strelka_ui/blueprints/auth.py:78,81,86,117` - Multiple commented logging statements
3. `app/strelka_ui/__main__.py:77` - Commented Flask dev server line
4. `app/strelka_ui/migrations/env.py:44` - Example configuration line

## Current Code Examples
```python
# app/strelka_ui/services/auth.py
# logging.warning("User not authenticated")
return None

# app/strelka_ui/blueprints/auth.py
# current_app.logger.error("Failed login validation: %s", err)
# current_app.logger.info("received login attempt for user %s", username)
# current_app.logger.info("ldap auth suceeded for user %s", ldapUser["user_cn"])
# current_app.logger.error("Failed connection to database: %s", err)

# app/strelka_ui/__main__.py
# main_app.run(host="0.0.0.0", port=80, threaded=True)
```

## Why Remove?
1. **Version control exists** - Git history preserves deleted code
2. **Creates confusion** - Unclear if code should be active
3. **Reduces readability** - Visual clutter
4. **No maintenance** - Commented code becomes outdated
5. **IDE tools available** - Can show git history for deleted lines

## Recommended Action

### Option 1: Remove Completely
If the code is truly not needed, remove it:
```python
# Before
# logging.warning("User not authenticated")
return None

# After
return None
```

### Option 2: Convert to Configurable Logging
If logging is needed but too verbose:
```python
# Before
# current_app.logger.info("received login attempt for user %s", username)

# After
logger.debug("received login attempt for user %s", username)
```

Then configure logging levels:
```python
# In development
logging.basicConfig(level=logging.DEBUG)

# In production
logging.basicConfig(level=logging.INFO)
```

### Option 3: Document in Commit Message
For the Flask dev server line:
```python
# Before
# uncomment below for local flask app development with hot reloading
# main_app.run(host="0.0.0.0", port=80, threaded=True)

# After - Remove and document in README
```

Add to README.md:
```markdown
## Development

### Hot Reload Development Server
For local development with hot reloading:

```python
# In __main__.py, replace serve() with:
main_app.run(host="0.0.0.0", port=8080, debug=True, threaded=True)
```
```

## Files to Clean
Run this to find commented code:
```bash
grep -rn "^\s*#\s*[a-z_].*(" --include="*.py" app/ | \
  grep -v "# pylint\|# type:\|# noqa"
```

## PR Checklist
- [ ] Review each commented line
- [ ] Decide: Remove, uncomment with proper config, or document
- [ ] Update README if removing development hints
- [ ] Test that application works without commented code
- [ ] Verify no critical code was accidentally removed

## Labels
`code-quality`, `technical-debt`, `good first issue`
