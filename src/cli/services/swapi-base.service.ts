import { Service } from 'typedi';
import { LogLevelsEnum } from '../enums/log-levels.enum';
import { IFilm, IWookieeFilm } from '../../shared/models/swapi-film.model';
import { FilmHttpService } from '../../shared/services/http/film.http.service';
import { PrettyPrinter } from '../utils/printers/pretty.printer';
import { PlanetHttpService } from '../../shared/services/http/planet.http.service';
import { urlParser } from '../utils/urls-parser.utils';
import { IPlanet } from '../../shared/models/swapi-planet.model';

@Service()
export class SwapiBaseService {

    // private films$ = this.filmService.films$;
    private film$ = this.filmService.film$;
    // private wookieFilms$ = this.filmService.wookieFilms$;
    private wookieFilm$ = this.filmService.wookieFilm$;

    constructor(private filmService: FilmHttpService, private planetHttpService: PlanetHttpService, private prettyPrinter: PrettyPrinter) {}

    public async swapiRun(params: string[]): Promise<void> {
        await this.filmService.getFilmById(+params[0], params.includes('w')).then(() => {
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
                this.film$.subscribe(async (film: IFilm) => {
                    this.prettyPrinter.prettyPrint(`Film ${ +(params[0]) } title: `, false, LogLevelsEnum.SUCCESS, 1);
                    this.prettyPrinter.prettyPrint(film.title, true, LogLevelsEnum.FANCY, 2);
                    this.prettyPrinter.prettyPrint(`Number of planets: `, false, LogLevelsEnum.SUCCESS, 1);
                    this.prettyPrinter.prettyPrint(film.planets.length.toString(), true, LogLevelsEnum.FANCY, 2);

                    const currentFilmPlanetIds: number[] = urlParser(film.planets);
                    await this.planetHttpService.getFilmPlanetsById(currentFilmPlanetIds).then((planets: IPlanet[]) => {
                        this.prettyPrinter.prettyPrint('Planets name: ', true, LogLevelsEnum.SUCCESS, 1);
                        planets.forEach((planet: IPlanet) => {
                            this.prettyPrinter.prettyPrint(planet.name, false, LogLevelsEnum.FANCY, 2);
                        });
                        this.prettyPrinter.emptyLinePrinter();

                        this.prettyPrinter.prettyPrint('Planets with water surfaces and mountains: ', true, LogLevelsEnum.SUCCESS,
                            1);

                        let totalDiameter = 0;
                        planets.filter((planet: IPlanet) => planet.terrain.toLowerCase().includes('mountains') && +planet.surface_water > 0)
                            .forEach((planet: IPlanet) => {
                                this.prettyPrinter.prettyPrint(`Planet: ${ planet.name }`, false, LogLevelsEnum.FANCY, 2);
                                this.prettyPrinter.prettyPrint(`Diameter: ${ planet.diameter }`, true, LogLevelsEnum.FANCY, 2);
                                totalDiameter += +planet.diameter;
                            });
                        this.prettyPrinter.prettyPrint(`Total diameter of planets with mountains and water surfaces: `, false,
                            LogLevelsEnum.SUCCESS, 2);
                        this.prettyPrinter.prettyPrint(`${ totalDiameter.toString() }`, true, LogLevelsEnum.FANCY, 3);
                        this.prettyPrinter.cliDelimiter('end');
                    });
                });
            }
        });
    }
}