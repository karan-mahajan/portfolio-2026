import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_experiences_type" AS ENUM('experience', 'education');
  CREATE TYPE "public"."enum_experiences_card_side" AS ENUM('left', 'right');
  CREATE TABLE "pages_blocks_hero_block_typewriter_strings" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_block_gradient_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Karan Mahajan',
  	"name_color" varchar DEFAULT '#16f2b3',
  	"accent_color" varchar DEFAULT '#ec4899',
  	"social_links_github" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_facebook" varchar,
  	"social_links_steam" varchar,
  	"resume_id" integer,
  	"contact_href" varchar DEFAULT '#contact',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"section_label" varchar DEFAULT 'ABOUT ME',
  	"heading" varchar DEFAULT 'Who am I?',
  	"heading_color" varchar DEFAULT '#16f2b3',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Experience & Education',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_block_typewriter_strings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_block_gradient_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"color" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Karan Mahajan',
  	"name_color" varchar DEFAULT '#16f2b3',
  	"accent_color" varchar DEFAULT '#ec4899',
  	"social_links_github" varchar,
  	"social_links_linkedin" varchar,
  	"social_links_facebook" varchar,
  	"social_links_steam" varchar,
  	"resume_id" integer,
  	"contact_href" varchar DEFAULT '#contact',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"section_label" varchar DEFAULT 'ABOUT ME',
  	"heading" varchar DEFAULT 'Who am I?',
  	"heading_color" varchar DEFAULT '#16f2b3',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Experience & Education',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "experiences_description" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar NOT NULL
  );
  
  CREATE TABLE "experiences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"start_date" varchar NOT NULL,
  	"end_date" varchar,
  	"type" "enum_experiences_type" DEFAULT 'experience' NOT NULL,
  	"card_side" "enum_experiences_card_side" DEFAULT 'left' NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_hero_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_version_hero_links" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_hero_links" CASCADE;
  DROP TABLE "_pages_v_version_hero_links" CASCADE;
  ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_media_id_media_id_fk";
  
  ALTER TABLE "_pages_v" DROP CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk";
  
  DROP INDEX "pages_hero_hero_media_idx";
  DROP INDEX "_pages_v_version_hero_version_hero_media_idx";
  ALTER TABLE "pages_blocks_skills" ADD COLUMN "show_cloud" boolean DEFAULT true;
  ALTER TABLE "_pages_v_blocks_skills" ADD COLUMN "show_cloud" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "experiences_id" integer;
  ALTER TABLE "pages_blocks_hero_block_typewriter_strings" ADD CONSTRAINT "pages_blocks_hero_block_typewriter_strings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_block_gradient_colors" ADD CONSTRAINT "pages_blocks_hero_block_gradient_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_block" ADD CONSTRAINT "pages_blocks_hero_block_resume_id_media_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_block" ADD CONSTRAINT "pages_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_block" ADD CONSTRAINT "pages_blocks_about_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_block" ADD CONSTRAINT "pages_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_experience" ADD CONSTRAINT "pages_blocks_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_block_typewriter_strings" ADD CONSTRAINT "_pages_v_blocks_hero_block_typewriter_strings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_block_gradient_colors" ADD CONSTRAINT "_pages_v_blocks_hero_block_gradient_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_block"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_block" ADD CONSTRAINT "_pages_v_blocks_hero_block_resume_id_media_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_block" ADD CONSTRAINT "_pages_v_blocks_hero_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_block" ADD CONSTRAINT "_pages_v_blocks_about_block_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_block" ADD CONSTRAINT "_pages_v_blocks_about_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_experience" ADD CONSTRAINT "_pages_v_blocks_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experiences_description" ADD CONSTRAINT "experiences_description_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_block_typewriter_strings_order_idx" ON "pages_blocks_hero_block_typewriter_strings" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_block_typewriter_strings_parent_id_idx" ON "pages_blocks_hero_block_typewriter_strings" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_block_gradient_colors_order_idx" ON "pages_blocks_hero_block_gradient_colors" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_block_gradient_colors_parent_id_idx" ON "pages_blocks_hero_block_gradient_colors" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_block_order_idx" ON "pages_blocks_hero_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_block_parent_id_idx" ON "pages_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_block_path_idx" ON "pages_blocks_hero_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_block_resume_idx" ON "pages_blocks_hero_block" USING btree ("resume_id");
  CREATE INDEX "pages_blocks_about_block_order_idx" ON "pages_blocks_about_block" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_block_parent_id_idx" ON "pages_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_block_path_idx" ON "pages_blocks_about_block" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_block_image_idx" ON "pages_blocks_about_block" USING btree ("image_id");
  CREATE INDEX "pages_blocks_experience_order_idx" ON "pages_blocks_experience" USING btree ("_order");
  CREATE INDEX "pages_blocks_experience_parent_id_idx" ON "pages_blocks_experience" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_experience_path_idx" ON "pages_blocks_experience" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_block_typewriter_strings_order_idx" ON "_pages_v_blocks_hero_block_typewriter_strings" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_block_typewriter_strings_parent_id_idx" ON "_pages_v_blocks_hero_block_typewriter_strings" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_block_gradient_colors_order_idx" ON "_pages_v_blocks_hero_block_gradient_colors" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_block_gradient_colors_parent_id_idx" ON "_pages_v_blocks_hero_block_gradient_colors" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_block_order_idx" ON "_pages_v_blocks_hero_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_block_parent_id_idx" ON "_pages_v_blocks_hero_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_block_path_idx" ON "_pages_v_blocks_hero_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_block_resume_idx" ON "_pages_v_blocks_hero_block" USING btree ("resume_id");
  CREATE INDEX "_pages_v_blocks_about_block_order_idx" ON "_pages_v_blocks_about_block" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_block_parent_id_idx" ON "_pages_v_blocks_about_block" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_block_path_idx" ON "_pages_v_blocks_about_block" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_block_image_idx" ON "_pages_v_blocks_about_block" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_experience_order_idx" ON "_pages_v_blocks_experience" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_experience_parent_id_idx" ON "_pages_v_blocks_experience" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_experience_path_idx" ON "_pages_v_blocks_experience" USING btree ("_path");
  CREATE INDEX "experiences_description_order_idx" ON "experiences_description" USING btree ("_order");
  CREATE INDEX "experiences_description_parent_id_idx" ON "experiences_description" USING btree ("_parent_id");
  CREATE INDEX "experiences_updated_at_idx" ON "experiences" USING btree ("updated_at");
  CREATE INDEX "experiences_created_at_idx" ON "experiences" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_experiences_fk" FOREIGN KEY ("experiences_id") REFERENCES "public"."experiences"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_experiences_id_idx" ON "payload_locked_documents_rels" USING btree ("experiences_id");
  ALTER TABLE "pages" DROP COLUMN "hero_type";
  ALTER TABLE "pages" DROP COLUMN "hero_rich_text";
  ALTER TABLE "pages" DROP COLUMN "hero_media_id";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_type";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_rich_text";
  ALTER TABLE "_pages_v" DROP COLUMN "version_hero_media_id";
  DROP TYPE "public"."enum_pages_hero_links_link_type";
  DROP TYPE "public"."enum_pages_hero_links_link_appearance";
  DROP TYPE "public"."enum_pages_hero_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_type";
  DROP TYPE "public"."enum__pages_v_version_hero_links_link_appearance";
  DROP TYPE "public"."enum__pages_v_version_hero_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_pages_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum_pages_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_version_hero_links_link_appearance" AS ENUM('default', 'outline');
  CREATE TYPE "public"."enum__pages_v_version_hero_type" AS ENUM('none', 'highImpact', 'mediumImpact', 'lowImpact');
  CREATE TABLE "pages_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_pages_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum_pages_hero_links_link_appearance" DEFAULT 'default'
  );
  
  CREATE TABLE "_pages_v_version_hero_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_type" "enum__pages_v_version_hero_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar,
  	"link_appearance" "enum__pages_v_version_hero_links_link_appearance" DEFAULT 'default',
  	"_uuid" varchar
  );
  
  ALTER TABLE "pages_blocks_hero_block_typewriter_strings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_block_gradient_colors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_experience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_block_typewriter_strings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_block_gradient_colors" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_hero_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_experience" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "experiences_description" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "experiences" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_hero_block_typewriter_strings" CASCADE;
  DROP TABLE "pages_blocks_hero_block_gradient_colors" CASCADE;
  DROP TABLE "pages_blocks_hero_block" CASCADE;
  DROP TABLE "pages_blocks_about_block" CASCADE;
  DROP TABLE "pages_blocks_experience" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_block_typewriter_strings" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_block_gradient_colors" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_block" CASCADE;
  DROP TABLE "_pages_v_blocks_about_block" CASCADE;
  DROP TABLE "_pages_v_blocks_experience" CASCADE;
  DROP TABLE "experiences_description" CASCADE;
  DROP TABLE "experiences" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_experiences_fk";
  
  DROP INDEX "payload_locked_documents_rels_experiences_id_idx";
  ALTER TABLE "pages" ADD COLUMN "hero_type" "enum_pages_hero_type" DEFAULT 'lowImpact';
  ALTER TABLE "pages" ADD COLUMN "hero_rich_text" jsonb;
  ALTER TABLE "pages" ADD COLUMN "hero_media_id" integer;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_type" "enum__pages_v_version_hero_type" DEFAULT 'lowImpact';
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_rich_text" jsonb;
  ALTER TABLE "_pages_v" ADD COLUMN "version_hero_media_id" integer;
  ALTER TABLE "pages_hero_links" ADD CONSTRAINT "pages_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_version_hero_links" ADD CONSTRAINT "_pages_v_version_hero_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_hero_links_order_idx" ON "pages_hero_links" USING btree ("_order");
  CREATE INDEX "pages_hero_links_parent_id_idx" ON "pages_hero_links" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_version_hero_links_order_idx" ON "_pages_v_version_hero_links" USING btree ("_order");
  CREATE INDEX "_pages_v_version_hero_links_parent_id_idx" ON "_pages_v_version_hero_links" USING btree ("_parent_id");
  ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_hero_hero_media_idx" ON "pages" USING btree ("hero_media_id");
  CREATE INDEX "_pages_v_version_hero_version_hero_media_idx" ON "_pages_v" USING btree ("version_hero_media_id");
  ALTER TABLE "pages_blocks_skills" DROP COLUMN "show_cloud";
  ALTER TABLE "_pages_v_blocks_skills" DROP COLUMN "show_cloud";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "experiences_id";
  DROP TYPE "public"."enum_experiences_type";
  DROP TYPE "public"."enum_experiences_card_side";`)
}
