import 'reflect-metadata';
import { Service } from 'typedi';
import { CliArgsParserService } from './services/cli-args-parser.service';
import { ErrorsPrinter } from './utils/printers/errors.printer';
import { PrettyPrinter } from './utils/printers/pretty.printer';
import { noArgsError } from './utils/errors/no-args.error';
import { LogLevelsEnum } from './enums/log-levels.enum';
import { SWAPI_BASE_COMMANDS } from './utils/cli.const';
import { unknownArgsError } from './utils/errors/unknown-args.error';
import { SwapiBaseService } from './services/swapi-base.service';

@Service()
export class Cli {

    constructor(private cliArgsParserService: CliArgsParserService, private errorsPrinter: ErrorsPrinter,
        private prettyPrinter: PrettyPrinter, private swapiBaseService: SwapiBaseService) {}

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
                await this.swapiBaseService.swapiRun(params);
            } else {
                this.errorsPrinter.errorPrinter(unknownArgsError);
            }
        }

    }
}
