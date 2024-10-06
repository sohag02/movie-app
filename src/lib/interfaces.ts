export interface  SearchResponse {
    page?:          number;
    results?:       Media[];
    total_pages?:   number;
    total_results?: number;
}

export interface MediaDetails extends MovieDetails, SeriesDetails {}

export interface Media extends Movie, Series {}


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
    popularity?:       number;
    first_air_date?:   string;
    vote_average:      number;
    vote_count:        number;
    origin_country?:   string[];
    title?:            string;
    original_title?:   string;
    release_date?:     string;
    video?:            boolean;
}

export interface Series {
    backdrop_path:      null |string;
    id:                 number;
    name?:              string;
    original_name?:     string;
    overview:           string;
    poster_path:        null |string;
    media_type:         MediaType;
    adult:              boolean;
    original_language:  string;
    genre_ids:          number[];
    popularity?:        number;
    first_air_date?:    string;
    vote_average:       number;
    vote_count:         number;
    origin_country?:    string[];
}

export enum MediaType {
    Movie = "movie",
    TV = "tv",
    Person = "person",
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
    "watch/providers"?:{
        results?: {
            IN?: {
                link?: string;
                rent?: Provider[];
                flatrate?: Provider[];
                buy?: Provider[];
            };
        };
    };
    "credits": Credits;
}

export interface Provider {
    logo_path: string;
    provider_id: number;
    provider_name: string;
    display_priority: number;
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
    watchlist: WatchlistMedia[];
}

export interface WatchlistMedia {
    id:           number;
    watchlist_id: number | null;
    movie_id:     number;
    media_type:   MediaType;
    user_id:      string;
    status:       string;
    added_at:     Date;
}

export interface WatchlistResponse {
    success: boolean;
    message: string;
}


export interface SeriesDetails {
    adult?:                boolean;
    backdrop_path?:        string;
    created_by?:           CreatedBy[];
    episode_run_time?:     number[];
    first_air_date?:       string;
    genres?:               Genre[];
    homepage?:             string;
    id?:                   number;
    in_production?:        boolean;
    languages?:            string[];
    last_air_date?:        Date;
    last_episode_to_air?:  LastEpisodeToAir;
    name?:                 string;
    next_episode_to_air?:  null;
    networks?:             Network[];
    number_of_episodes?:   number;
    number_of_seasons?:    number;
    origin_country?:       string[];
    original_language?:    string;
    original_name?:        string;
    overview?:             string;
    popularity?:           number;
    poster_path?:          string;
    production_companies?: Network[];
    production_countries?: ProductionCountry[];
    seasons?:              Season[];
    spoken_languages?:     SpokenLanguage[];
    status?:               string;
    tagline?:              string;
    type?:                 string;
    vote_average?:         number;
    vote_count?:           number;
    "watch/providers"?:{
        results?: {
            IN?: {
                link?: string;
                rent?: Provider[];
                flatrate?: Provider[];
                buy?: Provider[];
            };
        };
    };
    "credits": Credits;
}

export interface CreatedBy {
    id?:            number;
    credit_id?:     string;
    name?:          string;
    original_name?: string;
    gender?:        number;
    profile_path?:  string;
}

export interface Genre {
    id?:   number;
    name?: string;
}

export interface LastEpisodeToAir {
    id?:              number;
    name?:            string;
    overview?:        string;
    vote_average?:    number;
    vote_count?:      number;
    air_date?:        Date;
    episode_number?:  number;
    episode_type?:    string;
    production_code?: string;
    runtime?:         number;
    season_number?:   number;
    show_id?:         number;
    still_path?:      string;
}

export interface Network {
    id?:             number;
    logo_path?:      string;
    name?:           string;
    origin_country?: string;
}

export interface ProductionCountry {
    iso_3166_1?: string;
    name?:       string;
}

export interface Season {
    air_date?:      Date;
    episode_count?: number;
    id?:            number;
    name?:          string;
    overview?:      string;
    poster_path?:   string;
    season_number?: number;
    vote_average?:  number;
}

export interface SpokenLanguage {
    english_name?: string;
    iso_639_1?:    string;
    name?:         string;
}

export interface Credits {
    cast: Cast[];
    crew: Cast[];
}

export interface Cast {
    adult:                boolean;
    gender:               number;
    id:                   number;
    known_for_department: string;
    name:                 string;
    original_name:        string;
    popularity:           number;
    profile_path:         string;
    cast_id?:             number;
    character?:           string;
    credit_id:            string;
    order?:               number;
    department?:          string;
    job?:                 string;
}
