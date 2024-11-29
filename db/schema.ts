import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";

export const fontsTable = pgTable("fonts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  site: varchar({ length: 255 }).notNull(),
});

export const themesTable = pgTable("themes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  site: varchar({ length: 255 }).notNull(),
});

export const pairsTable = pgTable("pairs", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  fontId: integer("font_id").references(() => fontsTable.id),
  themeId: integer("theme_id").references(() => themesTable.id),
  likes: integer("likes").notNull(),
  previewUrl: text('preview_url').notNull(),
});
