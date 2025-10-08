# Use Cryptographically Secure Random for API Keys

## Issue Type
Security

## Priority
🔴 High

## Description
API key generation uses `random.choice()` which is not cryptographically secure, making keys potentially predictable.

## Location
`app/strelka_ui/blueprints/auth.py:41`

## Current Code
```python
from random import choice
from string import ascii_letters, digits

key = "".join(choice(ascii_letters + digits) for _ in range(32))
```

## Problem
The `random` module uses a pseudo-random number generator that is not suitable for security purposes. An attacker could potentially predict future API keys if they observe enough samples.

## Recommended Solution
Use the `secrets` module which is designed for generating cryptographically strong random numbers:

```python
import secrets

# Option 1: URL-safe token (recommended)
key = secrets.token_urlsafe(32)  # Generates ~43 character URL-safe string

# Option 2: Hexadecimal token
key = secrets.token_hex(32)  # Generates 64 character hex string

# Option 3: Custom character set (if needed)
import string
alphabet = string.ascii_letters + string.digits
key = ''.join(secrets.choice(alphabet) for _ in range(32))
```

## Testing
1. Generate multiple API keys and verify uniqueness
2. Verify keys work for authentication
3. Test key length is appropriate for storage
4. Verify no visible patterns in generated keys

## References
- [Python secrets module](https://docs.python.org/3/library/secrets.html)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

## Labels
`security`, `bug`, `good first issue`
