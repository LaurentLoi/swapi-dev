import 'reflect-metadata';
import { Service } from 'typedi';
import { CliArgsParserService } from './services/cli-args-parser.service';
import { ErrorsPrinter } from './utils/printers/errors.printer';
import { PrettyPrinter } from './utils/printers/pretty.printer';
import { noArgsError } from './utils/errors/no-args.error';
import { FilmHttpService } from '../shared/services/http/film.http.service';
import { LogLevelsEnum } from './enums/log-levels.enum';

@Service()
export class Cli {

    private films$ = this.filmService.films$;
    private film$ = this.filmService.film$;

    // todo add interface for base http response & films & planets

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
            if (['1', '2', '3', '4', '5', '6'].includes(params[0])) { // todo replace by const (+ file)
                await this.filmService.getFilmById(+params[0]).then(() => {
                    this.film$.subscribe((film: any) => {
                        this.prettyPrinter.prettyPrint(`Found film[${ +(params[0]) }] title: `, false, LogLevelsEnum.ALERT, 1);
                        this.prettyPrinter.prettyPrint(film.title, false, LogLevelsEnum.FANCY, 2);
                        this.prettyPrinter.prettyPrint(`Found film[${ +(params[0]) }] planet[0]: `, false, LogLevelsEnum.ALERT, 1);
                        this.prettyPrinter.prettyPrint(film.planets[0], false, LogLevelsEnum.FANCY, 2);
                    });
                });
            } else {
                await this.filmService.getAllFilms().then(() => {
                    this.films$.subscribe((films: any[]) => {
                        this.prettyPrinter.prettyPrint('Found film[0] title: ', false, LogLevelsEnum.ALERT, 1);
                        this.prettyPrinter.prettyPrint(films[0].title, false, LogLevelsEnum.FANCY, 2);
                        this.prettyPrinter.prettyPrint('Found film[0] planet[0]: ', false, LogLevelsEnum.ALERT, 1);
                        this.prettyPrinter.prettyPrint(films[0].planets[0], false, LogLevelsEnum.FANCY, 2);
                        // console.log('found film[0] opening crawl: ', films[0].opening_crawl);
                    });
                });
            }
        }
        this.prettyPrinter.cliDelimiter('end');
    }
}
