import 'reflect-metadata';
import { Service } from 'typedi';
import { CliArgsParserService } from './services/cli-args-parser.service';
import { ErrorsPrinter } from './utils/printers/errors.printer';
import { PrettyPrinter } from './utils/printers/pretty.printer';
import { noArgsError } from './utils/errors/no-args.error';
import { FilmHttpService } from '../shared/services/http/film.http.service';

@Service()
export class Cli {

    private films$ = this.filmService.films$;

    constructor(private cliArgsParserService: CliArgsParserService, private errorsPrinter: ErrorsPrinter,
        private prettyPrinter: PrettyPrinter, private filmService: FilmHttpService) {}

    public async run(): Promise<void> {
        this.prettyPrinter.cliDelimiter('start');
        this.prettyPrinter.cliTitlePrinter();

        const params = this.cliArgsParserService.getParsedArgs();
        this.prettyPrinter.prettyPrint(['Current cli params: ', ...params], true);

        if (!params.length) {
            this.errorsPrinter.errorPrinter(noArgsError);
        } else {
            this.prettyPrinter.prettyPrint('let\'s run the CLI !');
            await this.filmService.getAllFilms().then(() => {
                this.films$.subscribe((films: any[]) => {
                    console.log('found film[0] title: ', films[0].title);
                    // console.log('found film[0] opening crawl: ', films[0].opening_crawl);
                    console.log('Found film[0] planet[0]: ', films[0].planets[0]);
                });
            });
        }
        this.prettyPrinter.cliDelimiter('end');
    }
}
