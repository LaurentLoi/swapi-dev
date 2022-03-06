import { Service } from 'typedi';
import { BehaviorSubject, filter } from 'rxjs';
import { SwapiSubUrlsEnum } from '../../enums/swapi-sub-urls.enum';
import { environment } from '../../../environments/environment';
import { AxiosResponse } from 'axios';
import { IPlanet } from '../../models/swapi-planet.model';

const axios = require('axios').default;

@Service()
export class PlanetHttpService {

    private readonly planets = new BehaviorSubject<IPlanet[]>(null);
    public readonly planets$ = this.planets.pipe(filter(planets => !!planets));

    private readonly planet = new BehaviorSubject<IPlanet>(null);
    public readonly planet$ = this.planet.pipe(filter(planet => !!planet));

    private readonly wookiePlanets = new BehaviorSubject<IPlanet[]>(null);
    public readonly wookiePlanets$ = this.wookiePlanets.pipe(filter(wookiePlanets => !!wookiePlanets));

    private readonly wookiePlanet = new BehaviorSubject<IPlanet>(null);
    public readonly wookiePlanet$ = this.wookiePlanet.pipe(filter(wookiePlanet => !!wookiePlanet));

    private subUrls = SwapiSubUrlsEnum;

    public async getAllPlanets(wookiee?: boolean): Promise<void> {
        await axios.get(environment.swapi_url + this.subUrls.PLANETS + (wookiee ? '?format=wookiee' : ''))
            .then((response: AxiosResponse) => {
                if (wookiee) {
                    this.wookiePlanets.next(JSON.parse(response.data.replace(/\\rc\\wh/g, '').replace(/(whhuanan)/g, 'null')).rcwochuanaoc);
                } else {
                    this.planets.next(response.data.results);
                }
            });
    }

    public async getPlanetById(planetId: number, wookiee?: boolean): Promise<any> {
        await axios.get(
            environment.swapi_url + this.subUrls.PLANET.replace('${id}', planetId.toString()) + (wookiee ? '?format=wookiee' : ''))
            .then((response: AxiosResponse) => {
                if (wookiee) {
                    this.wookiePlanet.next(JSON.parse(response.data.replace(/\\rc\\wh/g, '')));
                } else {
                    this.planet.next(response.data);
                }
            });
    }
}
