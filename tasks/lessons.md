# Lessons

- Challenge contracts override the standard API wrapper. When a level says "return the same JSON it received", implement and test the exact raw response body instead of `{ success, data, message }`.
- Before marking a deployed challenge level ready, add an integration test for the exact endpoint path required by the platform. Missing routes should be caught locally before public submission.
