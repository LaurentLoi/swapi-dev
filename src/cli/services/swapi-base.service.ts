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
                    this.prettyPrinter.prettyPrint(`Found film[${ +(params[0]) }] title: `, false, LogLevelsEnum.ALERT, 1);
                    this.prettyPrinter.prettyPrint(film.title, false, LogLevelsEnum.FANCY, 2);
                    this.prettyPrinter.prettyPrint(`Found film[${ +(params[0]) }] planet[0]: `, false, LogLevelsEnum.ALERT, 1);
                    this.prettyPrinter.prettyPrint(film.planets[0], false, LogLevelsEnum.FANCY, 2);

                    const currentFilmPlanetIds: number[] = urlParser(film.planets);
                    await this.planetHttpService.getFilmPlanetsById(currentFilmPlanetIds);
                    this.planetHttpService.planetsByFilm$.subscribe((planets: IPlanet[]) => {
                        console.log('my planets: ', planets);
                    });
                });
            }
        });
    }

}
