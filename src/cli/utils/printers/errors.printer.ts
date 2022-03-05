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

        this.prettyPrinter.prettyPrint(error.error, false, LogLevelsEnum.ERROR);
        this.prettyPrinter.prettyPrint(error.description, false, LogLevelsEnum.ERROR);
        this.prettyPrinter.prettyPrint(error.resolution, true, LogLevelsEnum.ERROR);

        if (error.addBaseHelper) {
            this.baseUsagePrinter();
        }
    }

    private baseErrorPrinter(): void {
        this.prettyPrinter.emptyLinePrinter();
        this.prettyPrinter.prettyPrint('Sorry, an error occurred: ', true, LogLevelsEnum.ERROR);
    }

    private baseUsagePrinter(): void {
        this.prettyPrinter.prettyPrint('Here are the base cli commands: ', true); // add app desc
        commandsContainer.forEach((command: ICommand, index: number) => {
            this.commandPrinter(command, index + 1);
            command.optionalCommands?.forEach((subCommand: ICommand, subIndex: number) => {
                this.commandPrinter(subCommand, (index + 1) + '.' + (subIndex + 1));
            });
        });
    }

    private commandPrinter(command: ICommand, startLine: number | string): void { // todo add colors
        this.prettyPrinter.prettyPrint(`${ startLine }: ${ command.command }`);
        this.prettyPrinter.prettyPrint(`   Description: ${ command.description }`);
        this.prettyPrinter.prettyPrint(`   Optional command: ${ command.optional }`);
        this.prettyPrinter.prettyPrint(`   Eg.: npm start ${ command.exampleUsage }`, true);
    }

}
