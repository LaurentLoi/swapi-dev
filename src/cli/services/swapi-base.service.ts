import { Service } from 'typedi';
import { LogLevelsEnum } from '../enums/log-levels.enum';
import { IFilm, IWookieeFilm } from '../../shared/models/swapi-film.model';
import { FilmHttpService } from '../../shared/services/http/film.http.service';
import { PrettyPrinter } from '../utils/printers/pretty.printer';
import { PlanetHttpService } from '../../shared/services/http/planet.http.service';
import { urlParser } from '../utils/urls-parser.utils';
import { IPlanet, IWookieePlanet } from '../../shared/models/swapi-planet.model';
import { FilmPrinter } from '../utils/printers/film.printer';
import { PlanetPrinter } from '../utils/printers/planet.printer';

@Service()
export class SwapiBaseService {

    private film$ = this.filmService.film$;
    private wookieFilm$ = this.filmService.wookieFilm$;

    constructor(private filmService: FilmHttpService, private planetHttpService: PlanetHttpService, private prettyPrinter: PrettyPrinter,
        private filmPrinter: FilmPrinter, private planetPrinter: PlanetPrinter) {}

    public async swapiRun(params: string[]): Promise<void> {
        await this.filmService.getFilmById(+params[0], params.includes('w')).then(() => {
            if (params.includes('w')) {
                // Wookiee !
                this.manageWookieeFilm(params);
            } else {
                this.manageFilm(params);
            }
        });
    }

    private manageFilm(params: string[]): void {
        this.film$.subscribe(async (film: IFilm) => {
            this.filmPrinter.printFilm(film, +params[0]);
            const currentFilmPlanetIds: number[] = urlParser(film.planets);
            await this.planetHttpService.getFilmPlanetsById(currentFilmPlanetIds).then((planets: IPlanet[] | IWookieePlanet[]) => {

                this.filmPrinter.printFilmPlanets(planets as IPlanet[]);

                const filteredPlanets: IPlanet[] = (planets as IPlanet[]).filter((planet: IPlanet) =>
                    planet.terrain.toLowerCase().includes('mountains') && +planet.surface_water > 0,
                );

                this.prettyPrinter.prettyPrint(`Planets with water surfaces and mountains in "${ film.title }": `,
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
    }

    private manageWookieeFilm(params: string[]): void {
        this.wookieFilm$.subscribe(async (film: IWookieeFilm) => {
            this.prettyPrinter.prettyPrint('So you speak Wookiee ?! Whoaw that\'s great!', false, LogLevelsEnum.FANCY, 1);
            this.prettyPrinter.prettyPrint('(Thanks to: https://www.wookietranslator.com/)', true, LogLevelsEnum.FANCY, 2);
            this.filmPrinter.printWookieFilm(film, +params[0]);
            const currentFilmPlanetIds: number[] = urlParser(film.akanrawhwoaoc);
            await (this.planetHttpService.getFilmPlanetsById(currentFilmPlanetIds, true)).then(
                (planets: IPlanet[] | IWookieePlanet[]) => {
                    this.filmPrinter.printWookieFilmPlanets(planets as IWookieePlanet[]);

                    const filteredPlanets: IWookieePlanet[] = (planets as IWookieePlanet[]).filter((planet: IWookieePlanet) =>
                        planet.aoworcrcraahwh.toLowerCase().includes('Scoohuwhaoraahwhc') && +planet.churcwwraoawo_ohraaoworc > 0,
                    );

                    this.prettyPrinter.prettyPrint(
                        `Aarrragghuuhw uggguh raaaaaahhgh huurh aarrragghuuhw huuguughghg huuguughghg raaaaaahhgh "${ film.aoahaoanwo }": `,
                        false, LogLevelsEnum.SUCCESS, 1);
                    this.prettyPrinter.prettyPrint(`${ filteredPlanets.length.toString() }`, true, LogLevelsEnum.FANCY, 2);

                    let totalDiameter = 0;
                    filteredPlanets.forEach((planet: IWookieePlanet) => {
                        this.planetPrinter.printPlanetName(planet.whrascwo);
                        this.planetPrinter.printPlanetDiameter(+planet.waahrascwoaoworc, true);
                        totalDiameter += +planet.waahrascwoaoworc;
                    });

                    this.prettyPrinter.prettyPrint(
                        `Aaaaahnr huuguughghg aguhwwgggghhh aarrragghuuhw uugggh aaaaahnr uuh huuguughghg huuguughghg raaaaaahhgh: `,
                        false, LogLevelsEnum.SUCCESS, 2);
                    this.prettyPrinter.prettyPrint(`${ totalDiameter.toString() }`, true, LogLevelsEnum.FANCY, 3);
                    this.prettyPrinter.cliDelimiter('end');
                });
        });
    }
}
