import { Service } from 'typedi';
import { environment } from '../../../environments/environment';
import { SwapiSubUrlsEnum } from '../../enums/swapi-sub-urls.enum';
import { AxiosResponse } from 'axios';
import { BehaviorSubject, filter } from 'rxjs';
import { ISwapiFilm, IWookieeFilm } from '../../models/swapi-film.model';

const axios = require('axios').default;

@Service()
export class FilmHttpService {

    private readonly films = new BehaviorSubject<ISwapiFilm[]>(null);
    public readonly films$ = this.films.pipe(filter(films => !!films));

    private readonly film = new BehaviorSubject<ISwapiFilm>(null);
    public readonly film$ = this.film.pipe(filter(film => !!film));

    private readonly wookieFilms = new BehaviorSubject<IWookieeFilm[]>(null);
    public readonly wookieFilms$ = this.wookieFilms.pipe(filter(wookieFilms => !!wookieFilms));

    private readonly wookieFilm = new BehaviorSubject<IWookieeFilm>(null);
    public readonly wookieFilm$ = this.wookieFilm.pipe(filter(wookieFilm => !!wookieFilm));

    private subUrls = SwapiSubUrlsEnum;

    public async getAllFilms(wookiee?: boolean): Promise<void> {
        await axios.get(environment.swapi_url + this.subUrls.FILMS + (wookiee ? '?format=wookiee' : ''))
            .then((response: AxiosResponse) => {
                if (wookiee) {
                    console.log(JSON.parse(response.data.replace(/\\rc\\wh/g, '').replace(/(whhuanan)/g, 'null')).rcwochuanaoc);
                    this.wookieFilms.next(JSON.parse(response.data.replace(/\\rc\\wh/g, '').replace(/(whhuanan)/g, 'null')).rcwochuanaoc);
                } else {
                    this.films.next(response.data.results);
                }
            });
    }

    public async getFilmById(filmId: number, wookiee?: boolean): Promise<void> {
        await axios.get(environment.swapi_url + this.subUrls.FILM.replace('${id}', filmId.toString()) + (wookiee ? '?format=wookiee' : ''))
            .then((response: AxiosResponse) => {
                if (wookiee) {
                    this.wookieFilm.next(JSON.parse(response.data.replace(/\\rc\\wh/g, '')));
                } else {
                    this.film.next(response.data);
                }
            });
    }
}
