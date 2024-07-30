export interface  SearchResponse {
    page?:          number;
    results?:       Movie[];
    total_pages?:   number;
    total_results?: number;
}

export interface Movie {
    backdrop_path:     null | string;
    id:                number;
    name?:             string;
    original_name?:    string;
    overview:          string;
    poster_path:       null | string;
    media_type:        MediaType;
    adult:             boolean;
    original_language: string;
    genre_ids:         number[];
    popularity:        number;
    first_air_date?:   string;
    vote_average:      number;
    vote_count:        number;
    origin_country?:   string[];
    title?:            string;
    original_title?:   string;
    release_date?:     string;
    video?:            boolean;
}

export enum MediaType {
    Movie = "movie",
    TV = "tv",
}

export interface MovieDetails {
    adult?:                 boolean;
    backdrop_path?:         string;
    belongs_to_collection?: Collection;
    budget?:                number;
    genres?:                Genre[];
    homepage?:              string;
    id?:                    number;
    imdb_id?:               string;
    origin_country?:        string[];
    original_language?:     string;
    original_title?:        string;
    overview?:              string;
    popularity?:            number;
    poster_path?:           string;
    production_companies?:  ProductionCompany[];
    production_countries?:  ProductionCountry[];
    release_date?:          string;
    revenue?:               number;
    runtime?:               number;
    spoken_languages?:      SpokenLanguage[];
    status?:                string;
    tagline?:               string;
    title?:                 string;
    video?:                 boolean;
    vote_average?:          number;
    vote_count?:            number;
}

export interface Collection {
    id?:            number;
    name?:          string;
    poster_path?:   string;
    backdrop_path?: string;
}

export interface Genre {
    id?:   number;
    name?: string;
}

export interface ProductionCompany {
    id?:             number;
    logo_path?:      string;
    name?:           string;
    origin_country?: string;
}

export interface ProductionCountry {
    iso_3166_1?: string;
    name?:       string;
}

export interface SpokenLanguage {
    english_name?: string;
    iso_639_1?:    string;
    name?:         string;
}

export interface Watchlist {
    watchlist: WatchlistMovie[];
}

export interface WatchlistMovie {
    id:           number;
    watchlist_id: number | null;
    movie_id:     number;
    user_id:      string;
    status:       string;
    added_at:     Date;
}
