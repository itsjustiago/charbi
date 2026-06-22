CREATE TABLE "characters" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_en" text,
	"aka" text[],
	"gender" text NOT NULL,
	"era" text NOT NULL,
	"birth_year" integer,
	"death_year" integer,
	"lifespan" integer,
	"date_approx" boolean DEFAULT false NOT NULL,
	"role" text NOT NULL,
	"tagline" text NOT NULL,
	"summary" text NOT NULL,
	"key_facts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"scriptures" text[],
	"jw_url" text
);
--> statement-breakpoint
CREATE TABLE "eras" (
	"slug" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer NOT NULL,
	"color" text NOT NULL,
	"ordinal" integer NOT NULL,
	"summary" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "relationships" (
	"id" serial PRIMARY KEY NOT NULL,
	"from_slug" text NOT NULL,
	"to_slug" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_era_eras_slug_fk" FOREIGN KEY ("era") REFERENCES "public"."eras"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_from_slug_characters_slug_fk" FOREIGN KEY ("from_slug") REFERENCES "public"."characters"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relationships" ADD CONSTRAINT "relationships_to_slug_characters_slug_fk" FOREIGN KEY ("to_slug") REFERENCES "public"."characters"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "characters_era_idx" ON "characters" USING btree ("era");--> statement-breakpoint
CREATE INDEX "rel_from_idx" ON "relationships" USING btree ("from_slug");--> statement-breakpoint
CREATE INDEX "rel_to_idx" ON "relationships" USING btree ("to_slug");