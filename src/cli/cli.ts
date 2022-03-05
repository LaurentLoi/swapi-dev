import 'reflect-metadata';
import { Service } from 'typedi';
import { CliArgsParserService } from './services/cli-args-parser.service';
import { ErrorsPrinter } from './utils/printers/errors.printer';
import { PrettyPrinter } from './utils/printers/pretty.printer';
import { noArgsError } from './utils/errors/no-args.error';

@Service()
export class Cli {

    constructor(private cliArgsParserService: CliArgsParserService, private errorsPrinter: ErrorsPrinter,
        private prettyPrinter: PrettyPrinter) {}

    public run(): void {
        this.prettyPrinter.cliDelimiter('start');
        this.prettyPrinter.cliTitlePrinter();

        const params = this.cliArgsParserService.getParsedArgs();
        this.prettyPrinter.prettyPrint(['Current cli params: ', ...params], true);

        if (!params.length) {
            this.errorsPrinter.errorPrinter(noArgsError);
        } else {
            this.prettyPrinter.prettyPrint('let\'s run the CLI !');
        }
        this.prettyPrinter.cliDelimiter('end');
    }
}
