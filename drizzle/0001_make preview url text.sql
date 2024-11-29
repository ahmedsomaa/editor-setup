ALTER TABLE "pairs" ADD COLUMN "preview_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pairs" DROP COLUMN IF EXISTS "previewUrl";