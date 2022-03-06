import { Service } from 'typedi';
import { BehaviorSubject, filter } from 'rxjs';
import { SwapiSubUrlsEnum } from '../../enums/swapi-sub-urls.enum';
import { environment } from '../../../environments/environment';
import { AxiosResponse } from 'axios';
import { IPlanet } from '../../models/swapi-planet.model';
import { ErrorsPrinter } from '../../../cli/utils/printers/errors.printer';

const axios = require('axios').default;

@Service()
export class PlanetHttpService {

    private readonly planets = new BehaviorSubject<IPlanet[]>(null);
    public readonly planets$ = this.planets.pipe(filter(planets => !!planets));

    private readonly planetsByFilm = new BehaviorSubject<IPlanet[]>(null);
    public readonly planetsByFilm$ = this.planetsByFilm.pipe(filter(planetsByFilm => !!planetsByFilm));

    private readonly planet = new BehaviorSubject<IPlanet>(null);
    public readonly planet$ = this.planet.pipe(filter(planet => !!planet));

    private readonly wookiePlanets = new BehaviorSubject<IPlanet[]>(null);
    public readonly wookiePlanets$ = this.wookiePlanets.pipe(filter(wookiePlanets => !!wookiePlanets));

    private readonly wookiePlanet = new BehaviorSubject<IPlanet>(null);
    public readonly wookiePlanet$ = this.wookiePlanet.pipe(filter(wookiePlanet => !!wookiePlanet));

    private subUrls = SwapiSubUrlsEnum;

    constructor(private errorsPrinter: ErrorsPrinter) {}

    public async getAllPlanets(wookiee?: boolean): Promise<void> {
        try {
            await axios.get(environment.swapi_url + this.subUrls.PLANETS + (wookiee ? '?format=wookiee' : ''))
                .then((response: AxiosResponse) => {
                    if (wookiee) {
                        this.wookiePlanets.next(
                            JSON.parse(response.data.replace(/\\rc\\wh/g, '').replace(/(whhuanan)/g, 'null')).rcwochuanaoc);
                    } else {
                        this.planets.next(response.data.results);
                    }
                });
        } catch (e: any) {
            this.errorsPrinter.httpErrorPrinter(e);
        }
    }

    public async getPlanetById(planetId: number, wookiee?: boolean): Promise<any> {
        try {
            return await axios.get(
                environment.swapi_url + this.subUrls.PLANET.replace('${id}', planetId.toString()) + (wookiee ? '?format=wookiee' : ''))
                .then((response: AxiosResponse) => {
                    if (wookiee) {
                        this.wookiePlanet.next(JSON.parse(response.data.replace(/\\rc\\wh/g, '')));
                        return response;
                    } else {
                        this.planet.next(response.data);
                        return response;
                    }
                });
        } catch (e: any) {
            this.errorsPrinter.httpErrorPrinter(e);
        }
    }

    public async getFilmPlanetsById(ids: number[]): Promise<void> {
        let filmPlanets: IPlanet[];
        try {
            await Promise.all(ids.map((id: number) => this.getPlanetById(id))).then((results) => {
                filmPlanets = results.map((res) => {
                    return res.data;
                });
            });
            this.planetsByFilm.next(filmPlanets);
        } catch (e: any) {
            this.errorsPrinter.httpErrorPrinter(e);
        }
    }
}
