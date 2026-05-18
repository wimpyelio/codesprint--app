# CodeSprint PED Deviations

## Phase 1 / Step 1

1. Added `badge_catalog` table.
Reason: PED requires seeding a 14-badge catalog, while `achievements` is defined as a per-user award log (`user_id`, `badge_id`, `earned_at`). A separate catalog table is required to model both cleanly.

2. Seeded 10 beginner projects from existing repository direction + PED constraints.
Reason: The PED specifies the required count and schema fields but does not publish a canonical beginner project name list in the supplied document export. The seed list is additive and can be swapped later without schema changes.
