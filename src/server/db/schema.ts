import { pgTable, serial, integer, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const Movies = pgTable('movies', {
  id: serial('id').primaryKey(),
  watchlist_id: integer('watchlist_id'),
  movie_id: integer('movie_id').notNull(),
  media_type: text('media_type').notNull(),
  user_id: text('user_id').notNull(),
  status: text('status').notNull().default('watched'),
  added_at: timestamp('added_at').notNull().defaultNow(),
}, (table) => {
  return {
    uniqueMovieUser: uniqueIndex('unique_movie_user').on(table.movie_id, table.user_id, table.media_type)
  };
});

export const Watchlists = pgTable('watchlists', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  name: text('name').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

export const EpisodeWatchlist = pgTable('episode_watchlist', {
  id: serial('id').primaryKey(),
  series_id: integer('series_id').notNull(),
  episode_number: integer('episode_number').notNull(),
  season_number: integer('season_number').notNull(),
  user_id: text('user_id').notNull(),
  added_at: timestamp('added_at').notNull().defaultNow(),
}, (table) => {
  return {
    uniqueEpisodeUser: uniqueIndex('unique_episode_user').on(table.series_id, table.episode_number, table.season_number, table.user_id)
  };
});