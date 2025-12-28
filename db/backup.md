# Backup & Restore Procedures (Supabase)

## Automated backups
- Enable daily backups in the Supabase project settings.
- Set retention to meet your studio policy (recommended: 14-30 days).
- Add weekly manual snapshots before major releases.

## Restore procedure
1. Open Supabase dashboard → Database → Backups.
2. Select the snapshot to restore.
3. Restore to a new database instance to validate.
4. Point the admin app to the restored project after validation.

## Verification checklist
- Confirm `members` and `audit_logs` tables exist.
- Confirm `profiles` roles remain intact.
- Run a quick login + read test in the admin dashboard.
