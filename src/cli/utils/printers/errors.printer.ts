import { commandsContainer } from '../../commands';
import { ICommand } from '../../models/command.model';
import { Service } from 'typedi';
import { PrettyPrinter } from './pretty.printer';
import { LogLevelsEnum } from '../../enums/log-levels.enum';
import { ICliError } from '../../models/error.model';
import { CliColorsEnum } from '../../enums/cli-colors.enum';

@Service()
export class ErrorsPrinter {

    private colors = CliColorsEnum;

    constructor(private prettyPrinter: PrettyPrinter) {}

    public errorPrinter(error: ICliError): void {
        this.baseErrorPrinter();

        this.prettyPrinter.prettyPrint(error.error, false, LogLevelsEnum.ERROR, 1);
        this.prettyPrinter.prettyPrint(error.description, false, LogLevelsEnum.ERROR, 1);
        this.prettyPrinter.prettyPrint(error.resolution, true, LogLevelsEnum.ERROR, 1);

        if (error.addBaseHelper) {
            this.baseUsagePrinter();
        }
    }

    private baseErrorPrinter(): void {
        this.prettyPrinter.emptyLinePrinter();
        this.prettyPrinter.prettyPrint('Sorry, an error occurred: ', false, LogLevelsEnum.ERROR);
    }

    private baseUsagePrinter(): void {
        this.prettyPrinter.prettyPrint('Here are the base cli commands: ', true); // todo add app desc & title
        commandsContainer.forEach((command: ICommand, index: number) => {
            this.commandPrinter(command, index + 1);
            command.optionalCommands?.forEach((subCommand: ICommand, subIndex: number) => {
                this.commandPrinter(subCommand, (index + 1) + '.' + (subIndex + 1), 1);
            });
        });
    }

    private commandPrinter(command: ICommand, startLine: number | string, tab?: number): void {
        this.prettyPrinter.prettyPrint(`${ startLine }: ${ this.colors.GREEN }${ command.command }${ this.colors.RESET }`, false,
            LogLevelsEnum.INFO, tab);
        this.prettyPrinter.prettyPrint(`     Description: ${ this.colors.CYAN }${ command.description }${ this.colors.RESET }`, false,
            LogLevelsEnum.INFO, tab);
        this.prettyPrinter.prettyPrint(`     Optional command: ${ this.colors.YELLOW }${ command.optional }${ this.colors.RESET }`, false,
            LogLevelsEnum.INFO, tab);
        this.prettyPrinter.prettyPrint(`     Eg.: ${ this.colors.GREEN }npm start ${ command.exampleUsage }${ this.colors.RESET }`, true,
            LogLevelsEnum.INFO, tab);
    }

}
