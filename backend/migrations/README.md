# Migrations

- **Use `npm run db:migrate`** to apply migrations. The migration `0000_charming_spectrum.sql` is safe to run multiple times (enums created only if missing, tables use `IF NOT EXISTS`).

- **Do not run `npm run db:generate`** before migrating if you want to keep this safe migration. Generate overwrites existing migration files with plain `CREATE TYPE` / `CREATE TABLE`, which will fail if types or tables already exist.

- For **new** schema changes: change the schema in code, then run `db:generate` to create a **new** migration file (e.g. `0001_xxx.sql`). Then run `db:migrate`.

- **Use `db:migrate`**, not `db:push`, if your database does not support the `serial` type (e.g. some serverless Postgres). Push generates SQL that may use `serial`.

- **Migration `0001_add_user_id_and_unique_org.sql`**: Adds `user_id` to `vendor_onboarding` and `buyer_onboarding`, and enforces one onboarding per org (unique index on `organization_id`). If you already have duplicate `organization_id` rows, fix or remove duplicates before running this migration.
