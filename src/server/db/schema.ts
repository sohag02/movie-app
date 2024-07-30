import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const Movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  watchlist_id: integer('watchlist_id'),
  movie_id: integer('movie_id').notNull(),
  user_id: text('user_id').notNull(),
  status: text('status').notNull().default('watched'),
  added_at: timestamp('added_at').notNull().defaultNow(),
})

export const Watchlists = pgTable('watchlists', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})
