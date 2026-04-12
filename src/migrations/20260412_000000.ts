import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "projects_technologies" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "tech" varchar NOT NULL
   );

   CREATE TABLE "projects" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "year" numeric NOT NULL,
    "category" varchar NOT NULL,
    "role" varchar NOT NULL,
    "description" varchar NOT NULL,
    "thumbnail_id" integer,
    "accent_color" varchar DEFAULT '#7c3aed',
    "live_url" varchar,
    "github_url" varchar,
    "is_private" boolean DEFAULT false,
    "order" numeric NOT NULL DEFAULT 0,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
   );

   CREATE TABLE "pages_blocks_projects" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar DEFAULT 'Projects',
    "block_name" varchar
   );

   CREATE TABLE "_pages_v_blocks_projects" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar DEFAULT 'Projects',
    "_uuid" varchar,
    "block_name" varchar
   );

   ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;

   ALTER TABLE "projects_technologies" ADD CONSTRAINT "projects_technologies_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

   ALTER TABLE "projects" ADD CONSTRAINT "projects_thumbnail_id_media_id_fk"
    FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

   ALTER TABLE "pages_blocks_projects" ADD CONSTRAINT "pages_blocks_projects_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;

   ALTER TABLE "_pages_v_blocks_projects" ADD CONSTRAINT "_pages_v_blocks_projects_parent_id_fk"
    FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;

   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk"
    FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;

   CREATE INDEX "projects_technologies_order_idx" ON "projects_technologies" USING btree ("_order");
   CREATE INDEX "projects_technologies_parent_id_idx" ON "projects_technologies" USING btree ("_parent_id");
   CREATE INDEX "projects_thumbnail_idx" ON "projects" USING btree ("thumbnail_id");
   CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
   CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
   CREATE INDEX "pages_blocks_projects_order_idx" ON "pages_blocks_projects" USING btree ("_order");
   CREATE INDEX "pages_blocks_projects_parent_id_idx" ON "pages_blocks_projects" USING btree ("_parent_id");
   CREATE INDEX "pages_blocks_projects_path_idx" ON "pages_blocks_projects" USING btree ("_path");
   CREATE INDEX "_pages_v_blocks_projects_order_idx" ON "_pages_v_blocks_projects" USING btree ("_order");
   CREATE INDEX "_pages_v_blocks_projects_parent_id_idx" ON "_pages_v_blocks_projects" USING btree ("_parent_id");
   CREATE INDEX "_pages_v_blocks_projects_path_idx" ON "_pages_v_blocks_projects" USING btree ("_path");
   CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_technologies" DISABLE ROW LEVEL SECURITY;
   ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
   ALTER TABLE "pages_blocks_projects" DISABLE ROW LEVEL SECURITY;
   ALTER TABLE "_pages_v_blocks_projects" DISABLE ROW LEVEL SECURITY;

   DROP TABLE "projects_technologies" CASCADE;
   DROP TABLE "projects" CASCADE;
   DROP TABLE "pages_blocks_projects" CASCADE;
   DROP TABLE "_pages_v_blocks_projects" CASCADE;

   ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
   DROP INDEX "payload_locked_documents_rels_projects_id_idx";
   ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  `)
}
