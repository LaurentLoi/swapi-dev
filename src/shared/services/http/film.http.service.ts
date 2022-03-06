import { Service } from 'typedi';
import { environment } from '../../../environments/environment';
import { SwapiSubUrlsEnum } from '../../enums/swapi-sub-urls.enum';
import { AxiosResponse } from 'axios';
import { BehaviorSubject, filter } from 'rxjs';

const axios = require('axios').default;

@Service()
export class FilmHttpService {

    private readonly films = new BehaviorSubject<any[]>([]);
    public readonly films$ = this.films.pipe(filter(films => !!films));

    private readonly film = new BehaviorSubject<any>(null);
    public readonly film$ = this.film.pipe(filter(film => !!film));

    private subUrls = SwapiSubUrlsEnum;

    public async getAllFilms(): Promise<void> {
        await axios.get(environment.swapi_url + this.subUrls.FILMS).then((response: AxiosResponse<any>) => {
            this.films.next(response.data.results);
        });
    }

    public async getFilmById(filmId: number): Promise<any> {
        await axios.get(environment.swapi_url + this.subUrls.FILMS + filmId.toString()).then((response: AxiosResponse) => {
            this.film.next(response.data);
        });
    }
}
