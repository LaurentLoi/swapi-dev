import 'reflect-metadata';
import { Service } from 'typedi';
import { CliArgsParserService } from './services/cli-args-parser.service';
import { ErrorsPrinter } from './utils/printers/errors.printer';
import { PrettyPrinter } from './utils/printers/pretty.printer';

@Service()
export class Cli {

    constructor(private cliArgsParserService: CliArgsParserService, private errorsPrinter: ErrorsPrinter,
        private prettyPrinter: PrettyPrinter) {}

    public run(): void {
        this.prettyPrinter.cliDelimiter('start');
        this.prettyPrinter.prettyPrint('Hello world from base cli app !');

        const params = this.cliArgsParserService.getParsedArgs();
        this.prettyPrinter.prettyPrint(['Current cli params: ', ...params]);

        if (!params.length) {
            this.errorsPrinter.noArgsPrinter();
        } else {
            this.prettyPrinter.prettyPrint('let\'s run the CLI !');
        }
        this.prettyPrinter.cliDelimiter('end');
    }
}
