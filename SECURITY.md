# SECURITY

Prototype mode notes (must fix before prod):
- Add auth (no auth in prototype). Use demo-user only.
- Lock down Firestore rules (currently permissive for demo).
- Enforce HTTPS, HSTS, secure cookies, CSRF.
- Add rate limiting, input validation (present), and WAF/CDN.
- Secrets via deployment UI, rotate regularly.
- Add Sentry monitoring and alerting.
