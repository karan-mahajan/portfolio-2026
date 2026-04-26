import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_about_block"
      ALTER COLUMN "description" TYPE jsonb USING NULL;

    ALTER TABLE "_pages_v_blocks_about_block"
      ALTER COLUMN "description" TYPE jsonb USING NULL;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_about_block"
      ALTER COLUMN "description" TYPE varchar USING NULL;

    ALTER TABLE "_pages_v_blocks_about_block"
      ALTER COLUMN "description" TYPE varchar USING NULL;
  `)
}
