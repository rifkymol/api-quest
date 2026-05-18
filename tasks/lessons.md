# Lessons

- Challenge contracts override the standard API wrapper. When a level says "return the same JSON it received", implement and test the exact raw response body instead of `{ success, data, message }`.
- Before marking a deployed challenge level ready, add an integration test for the exact endpoint path required by the platform. Missing routes should be caught locally before public submission.
- For API Quest resource levels, do not assume the existing `/items` API satisfies a named contract. If the level says `/books`, build `/books` and test raw arrays/objects exactly.
- When a later level extends an earlier resource, update the same in-memory store and add persistence tests across create, update, delete, and get-by-id.
- When a challenge level adds auth, protect only the exact endpoints named in the level. For Level 5, only `GET /books` is protected; other `/books` methods keep their previous behavior.
- For protected query levels, keep the auth guard and successful raw response shape while changing only the selection logic. Filtering and pagination should operate on a copied array before returning raw JSON.
- For error-handling levels, patch only the failing validation path when 404 behavior already passes. Validate before mutating in-memory stores so bad requests do not consume IDs or create partial records.
- Avoid request-count-dependent behavior for challenge compatibility. Testers rerun levels and service state persists, so public endpoints like `GET /books` must be deterministic across repeated calls.
- When a screenshot shows the active gate, optimize for that exact failing contract. For Level 5, `GET /books` must return 401 without a valid token even if earlier levels previously needed a raw public array.
