import 'reflect-metadata';
import { Service } from 'typedi';
import { CliArgsParserService } from './services/cli-args-parser.service';
import { ErrorsPrinter } from './utils/printers/errors.printer';
import { PrettyPrinter } from './utils/printers/pretty.printer';
import { noArgsError } from './utils/errors/no-args.error';
import { FilmHttpService } from '../shared/services/http/film.http.service';
import { LogLevelsEnum } from './enums/log-levels.enum';
import { IFilm, IWookieeFilm } from '../shared/models/swapi-film.model';
import { SWAPI_BASE_COMMANDS } from './utils/cli.const';

@Service()
export class Cli {

    private films$ = this.filmService.films$;
    private film$ = this.filmService.film$;
    private wookieFilms$ = this.filmService.wookieFilms$;
    private wookieFilm$ = this.filmService.wookieFilm$;

    constructor(private cliArgsParserService: CliArgsParserService, private errorsPrinter: ErrorsPrinter,
        private prettyPrinter: PrettyPrinter, private filmService: FilmHttpService) {}

    public async run(): Promise<void> {
        this.prettyPrinter.cliDelimiter('start');
        this.prettyPrinter.cliTitlePrinter();

        const params = this.cliArgsParserService.getParsedArgs();
        this.prettyPrinter.prettyPrint('Current cli params: ');
        this.prettyPrinter.prettyPrint([...params], true, LogLevelsEnum.ALERT, 1);

        if (!params.length) {
            this.errorsPrinter.errorPrinter(noArgsError);
        } else {
            if (SWAPI_BASE_COMMANDS.includes(params[0])) {

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
                        this.film$.subscribe((film: IFilm) => {
                            this.prettyPrinter.prettyPrint(`Found film[${ +(params[0]) }] title: `, false, LogLevelsEnum.ALERT, 1);
                            this.prettyPrinter.prettyPrint(film.title, false, LogLevelsEnum.FANCY, 2);
                            this.prettyPrinter.prettyPrint(`Found film[${ +(params[0]) }] planet[0]: `, false, LogLevelsEnum.ALERT, 1);
                            this.prettyPrinter.prettyPrint(film.planets[0], false, LogLevelsEnum.FANCY, 2);
                        });
                    }
                });
            } else {
                // todo add unknown command
                await this.filmService.getAllFilms(params.includes('w')).then(() => {
                    // Wookiee !
                    if (params.includes('w')) {
                        this.wookieFilms$.subscribe((films: IWookieeFilm[]) => {
                            this.prettyPrinter.prettyPrint('Found film[0] title: ', false, LogLevelsEnum.ALERT, 1);
                            this.prettyPrinter.prettyPrint(films[0].aoahaoanwo, false, LogLevelsEnum.FANCY, 2);
                            this.prettyPrinter.prettyPrint('Found film[0] planet[0]: ', false, LogLevelsEnum.ALERT, 1);
                            this.prettyPrinter.prettyPrint(films[0].akanrawhwoaoc[0], false, LogLevelsEnum.FANCY, 2);
                            // console.log('found film[0] opening crawl: ', films[0].opening_crawl);
                        });
                    } else {
                        this.films$.subscribe((films: IFilm[]) => {
                            this.prettyPrinter.prettyPrint('Found film[0] title: ', false, LogLevelsEnum.ALERT, 1);
                            this.prettyPrinter.prettyPrint(films[0].title, false, LogLevelsEnum.FANCY, 2);
                            this.prettyPrinter.prettyPrint('Found film[0] planet[0]: ', false, LogLevelsEnum.ALERT, 1);
                            this.prettyPrinter.prettyPrint(films[0].planets[0], false, LogLevelsEnum.FANCY, 2);
                            // console.log('found film[0] opening crawl: ', films[0].opening_crawl);
                        });
                    }
                });
            }
        }
        this.prettyPrinter.cliDelimiter('end');
    }
}
