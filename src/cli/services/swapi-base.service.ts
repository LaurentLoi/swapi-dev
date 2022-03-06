import { Service } from 'typedi';
import { LogLevelsEnum } from '../enums/log-levels.enum';
import { IFilm, IWookieeFilm } from '../../shared/models/swapi-film.model';
import { FilmHttpService } from '../../shared/services/http/film.http.service';
import { PrettyPrinter } from '../utils/printers/pretty.printer';
import { PlanetHttpService } from '../../shared/services/http/planet.http.service';
import { urlParser } from '../utils/urls-parser.utils';
import { IPlanet } from '../../shared/models/swapi-planet.model';
import { FilmPrinter } from '../utils/printers/film.printer';
import { PlanetPrinter } from '../utils/printers/planet.printer';

@Service()
export class SwapiBaseService {

    // private films$ = this.filmService.films$;
    private film$ = this.filmService.film$;
    // private wookieFilms$ = this.filmService.wookieFilms$;
    private wookieFilm$ = this.filmService.wookieFilm$;

    constructor(private filmService: FilmHttpService, private planetHttpService: PlanetHttpService, private prettyPrinter: PrettyPrinter,
        private filmPrinter: FilmPrinter, private planetPrinter: PlanetPrinter) {}

    public async swapiRun(params: string[]): Promise<void> {
        // Wookiee !
        if (params.includes('w')) {
            this.prettyPrinter.prettyPrint('So you speak Wookiee ?! Whoaw that\'s great!', true, LogLevelsEnum.FANCY, 1);
            this.wookieFilm$.subscribe((film: IWookieeFilm) => {
                this.prettyPrinter.prettyPrint(`Raaaaaahhgh uughghhhgh[${ +(params[0]) }] wrrhwrwwhw: `, false,
                    LogLevelsEnum.ALERT,
                    1);
                this.prettyPrinter.prettyPrint(film.aoahaoanwo, false, LogLevelsEnum.FANCY, 2);
                this.prettyPrinter.prettyPrint(`Raaaaaahhgh uughghhhgh[${ +(params[0]) }] uughghhhgh aarrragghuuhw[0]: `, false,
                    LogLevelsEnum.ALERT, 1);
                this.prettyPrinter.prettyPrint(film.akanrawhwoaoc[0], false, LogLevelsEnum.FANCY, 2);
            });
        } else {
            await this.filmService.getFilmById(+params[0], params.includes('w')).then(() => {
                this.film$.subscribe(async (film: IFilm) => {
                    this.filmPrinter.printFilm(film);
                    const currentFilmPlanetIds: number[] = urlParser(film.planets);
                    await this.planetHttpService.getFilmPlanetsById(currentFilmPlanetIds).then((planets: IPlanet[]) => {

                        this.filmPrinter.printFilmPlanets(planets);

                        const filteredPlanets: IPlanet[] = planets.filter((planet: IPlanet) =>
                            planet.terrain.toLowerCase().includes('mountains') && +planet.surface_water > 0,
                        );

                        this.prettyPrinter.prettyPrint('Planets with water surfaces and mountains: ',
                            false, LogLevelsEnum.SUCCESS, 1);
                        this.prettyPrinter.prettyPrint(`${ filteredPlanets.length.toString() }`, true, LogLevelsEnum.FANCY, 2);

                        let totalDiameter = 0;
                        filteredPlanets.forEach((planet: IPlanet) => {
                            this.planetPrinter.printPlanetName(planet.name);
                            this.planetPrinter.printPlanetDiameter(+planet.diameter);
                            totalDiameter += +planet.diameter;
                        });

                        this.prettyPrinter.prettyPrint(`Total diameter of planets with mountains and water surfaces: `,
                            false, LogLevelsEnum.SUCCESS, 2);
                        this.prettyPrinter.prettyPrint(`${ totalDiameter.toString() }`, true, LogLevelsEnum.FANCY, 3);
                        this.prettyPrinter.cliDelimiter('end');
                    });
                });
            });
        }
    }
}
