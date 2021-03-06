import 'reflect-metadata';
import { Service } from 'typedi';
import { CliArgsParserService } from './services/cli-args-parser.service';
import { ErrorsPrinter } from './utils/printers/errors.printer';
import { PrettyPrinter } from './utils/printers/pretty.printer';
import { noArgsError } from './utils/errors/no-args.error';
import { LogLevelsEnum } from './enums/log-levels.enum';
import { HELPER_COMMANDS, SWAPI_BASE_COMMANDS } from './utils/cli.const';
import { unknownArgsError } from './utils/errors/unknown-args.error';
import { SwapiBaseService } from './services/swapi-base.service';

@Service()
export class Cli {

    constructor(private cliArgsParserService: CliArgsParserService, private errorsPrinter: ErrorsPrinter,
        private prettyPrinter: PrettyPrinter, private swapiBaseService: SwapiBaseService) {}

    public run(): void {
        this.prettyPrinter.cliDelimiter('start');
        this.prettyPrinter.cliTitlePrinter();

        const params = this.cliArgsParserService.getParsedArgs();
        this.prettyPrinter.prettyPrint('Current cli params: ', true, LogLevelsEnum.ALERT);
        this.prettyPrinter.prettyPrint([...params], true, LogLevelsEnum.ALERT, 1);
        this.prettyPrinter.prettyPrint('  -----', true, LogLevelsEnum.FANCY, 0);

        if (!params.length) {
            this.errorsPrinter.errorPrinter(noArgsError);
        } else {
            if (SWAPI_BASE_COMMANDS.includes(params[0])) {
                this.swapiBaseService.swapiRun(params);
            } else if (params.includes(HELPER_COMMANDS[0]) || params.includes(HELPER_COMMANDS[1])) {
                this.errorsPrinter.helperPrinter();
            } else {
                this.errorsPrinter.errorPrinter(unknownArgsError);
            }
        }

    }
}
