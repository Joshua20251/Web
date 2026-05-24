# Security Specification: Co-exist Pitch

## Data Invariants
- Feedback documents must be immutable once created.
- All feedback fields (`content`, `atmosphere`, `issue`, `createdAt`) are required.
- `createdAt` must be the server timestamp.
- Anonymous create is allowed.
- Read access is restricted to authenticated administrators.

## The Dirty Dozen Payloads

| ID | Operation | Payload | Expected Outcome | Violation |
|----|-----------|---------|------------------|-----------|
| 1 | Create | `{}` | DENIED | Missing required fields |
| 2 | Create | `{"content": "hi", "atmosphere": "tense", "issue": "bias", "createdAt": "2023-01-01T00:00:00Z"}` | DENIED | Client-provided timestamp |
| 3 | Create | `{"content": "...", "atmosphere": "tense", "issue": "bias", "createdAt": "request.time", "extra": "evil"}` | DENIED | Shadow field injection |
| 4 | Create | `{"content": "short", ...}` | DENIED | Content size < min or > max |
| 5 | Update | `{"content": "modified"}` | DENIED | Feedback is immutable |
| 6 | Delete | - | DENIED | Delete not allowed for users |
| 7 | List | - | DENIED (if unauth) | Read restricted to admin |
| 8 | Create | `{"content": 123, ...}` | DENIED | Type mismatch (string expected) |
| 9 | Create | `{"content": "a".repeat(1001), ...}` | DENIED | Content exceeds max size (1000) |
| 10 | Create | `{"content": "ok", "atmosphere": "bad".repeat(100), ...}` | DENIED | Atmosphere exceeds max size (100) |
| 11 | Create | `{"content": "ok", "atmosphere": "ok", "issue": "bad".repeat(100), ...}` | DENIED | Issue exceeds max size (200) |
| 12 | Get | `isValidId(poisoned_id)` | DENIED | ID poisoning prevention |

## Test Runner (Logic)
The `firestore.rules` will implement `isValidFeedback()` helper and use `affectedKeys().hasOnly()` logic.
Admin access will be verified via `request.auth.token.email`.

Admin: `joshua917813@gmail.com`
