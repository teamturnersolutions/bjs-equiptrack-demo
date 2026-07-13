# Project-Scoped Rules for EquipTrack

## Adjustment Pipeline
Whenever making code changes, bug fixes, or architecture adjustments to the application:
1. Always rebuild the Docker container locally using `docker compose up -d --build`.
2. Wait for the container to finish building and successfully start.
3. Verify the application is healthy and the fix is active before committing or pushing changes to the repository.
