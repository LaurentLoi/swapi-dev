import { Service } from 'typedi';
import { BehaviorSubject, filter } from 'rxjs';
import { SwapiSubUrlsEnum } from '../../enums/swapi-sub-urls.enum';
import { environment } from '../../../environments/environment';
import { AxiosResponse } from 'axios';
import { ISwapiPlanet } from '../../models/swapi-planet.model';

const axios = require('axios').default;

@Service()
export class PlanetHttpService {

    private readonly planets = new BehaviorSubject<ISwapiPlanet[]>(null);
    public readonly planets$ = this.planets.pipe(filter(planets => !!planets));

    private readonly planet = new BehaviorSubject<ISwapiPlanet>(null);
    public readonly planet$ = this.planet.pipe(filter(planet => !!planet));

    private subUrls = SwapiSubUrlsEnum;

    public async getAllPlanets(): Promise<void> {
        await axios.get(environment.swapi_url + this.subUrls.PLANETS).then((response: AxiosResponse) => {
            this.planets.next(response.data.results);
        });
    }

    public async getPlanetById(planetId: number): Promise<any> {
        await axios.get(environment.swapi_url + this.subUrls.PLANET.replace('${id}', planetId.toString()))
            .then((response: AxiosResponse) => {
                this.planet.next(response.data);
            });
    }
}
