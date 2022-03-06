export interface ISwapiFilm {
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: string[];
    planets: string[];
    starships: string[];
    vehicles: string[];
    species: string[];
    created: Date;
    edited: Date;
    ulr: string;
}

export interface IWookieeFilm {
    aoahaoanwo: string;
    woakahcoowawo_ahwa: number;
    ooakwowhahwhrr_oarcraohan: string;
    waahrcwooaaooorc: string;
    akrcoowahuoaworc: string;
    rcwoanworacwo_waraaowo: string;
    oaacrarcraoaaoworcc: string[];
    akanrawhwoaoc: string[];
    caorarccacahakc: string[];
    howoacahoaanwoc: string[];
    cakwooaahwoc: string[];
    oarcworaaowowa: Date;
    wowaahaowowa: Date;
    hurcan: string;
}
