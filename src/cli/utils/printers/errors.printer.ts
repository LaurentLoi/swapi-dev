import { commandsContainer } from '../../commands';
import { ICommand } from '../../models/command.model';
import { Service } from 'typedi';
import { PrettyPrinter } from './pretty.printer';
import { LogLevelsEnum } from '../../enums/log-levels.enum';
import { ICliError } from '../../models/error.model';

@Service()
export class ErrorsPrinter {

    constructor(private prettyPrinter: PrettyPrinter) {}

    public errorPrinter(error: ICliError): void {
        this.baseErrorPrinter();

        this.prettyPrinter.prettyPrint(error.error, false, LogLevelsEnum.ERROR, 1);
        this.prettyPrinter.prettyPrint(error.description, false, LogLevelsEnum.ERROR, 1);
        this.prettyPrinter.prettyPrint(error.resolution, true, LogLevelsEnum.ERROR, 1);

        if (error.addBaseHelper) {
            this.baseUsagePrinter();
        }

        this.prettyPrinter.cliDelimiter('end');
    }

    public httpErrorPrinter(error: any): void {
        this.prettyPrinter.prettyPrint('Sorry, an http error occured:', true, LogLevelsEnum.ERROR);
        if (error.config && error.response) {

            this.prettyPrinter.prettyPrint(
                [
                    error.config.method.toString().toUpperCase(),
                    error.config.url,
                    error.response.status.toString(),
                    error.response.statusText,
                ], true,
                LogLevelsEnum.ERROR, 1);
        } else {
            this.prettyPrinter.prettyPrint(error.toString(), true, LogLevelsEnum.ERROR, 1);
        }

        this.prettyPrinter.cliDelimiter('end');
    }

    private baseErrorPrinter(): void {
        this.prettyPrinter.emptyLinePrinter();
        this.prettyPrinter.prettyPrint('Sorry, an error occurred: ', false, LogLevelsEnum.ERROR);
    }

    private baseUsagePrinter(): void {
        this.prettyPrinter.prettyPrint('Here are the base cli commands: ', true);
        commandsContainer.forEach((command: ICommand, index: number) => {
            this.commandPrinter(command, index + 1);
            command.optionalCommands?.forEach((subCommand: ICommand, subIndex: number) => {
                this.commandPrinter(subCommand, (index + 1) + '.' + (subIndex + 1), 1);
            });
        });
    }

    private commandPrinter(command: ICommand, startLine: number | string, tab?: number): void {
        this.prettyPrinter.prettyPrint(`${ startLine }: ${ command.command }`, false,
            LogLevelsEnum.SUCCESS, tab);
        this.prettyPrinter.prettyPrint(`Description: ${ command.description }`, false,
            LogLevelsEnum.FANCY, (tab ? tab + 1 : 1));
        this.prettyPrinter.prettyPrint(`Optional command: ${ command.optional }`, false,
            LogLevelsEnum.ALERT, (tab ? tab + 1 : 1));
        this.prettyPrinter.prettyPrint(`Eg.: npm start ${ command.exampleUsage }`, true,
            LogLevelsEnum.SUCCESS, (tab ? tab + 1 : 1));
    }

}
