---
name: Fresh artifact builds
description: Production artifact builds must generate every runtime output from a clean source snapshot.
---

Artifact production builds must explicitly build workspace packages whose runtime exports point to generated output.

**Why:** Local generated files can mask a missing build step, but fresh publishing starts without ignored `dist` directories and the service then crashes despite compiling its own artifact.

**How to apply:** When an artifact consumes runtime workspace libraries, use a dependency-inclusive build selection or an equivalent pre-build step, and validate after deleting generated outputs.