import { Service } from 'typedi';
import { Axios } from 'axios';
import { environment } from '../../../environments/environment';
import { SwapiSubUrlsEnum } from '../../enums/swapi-sub-urls.enum';

@Service()
export class FilmHttpService {

    private subUrls = SwapiSubUrlsEnum;

    constructor(private axios: Axios) {}

    public async getAllFilms(): Promise<any[]> {
        return await this.axios.get(environment.swapi_url + this.subUrls.FILMS);
    }
}
