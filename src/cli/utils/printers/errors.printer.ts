import { commandsContainer } from '../../commands';
import { ICommand } from '../../models/command.model';
import { Service } from 'typedi';
import { PrettyPrinter } from './pretty.printer';
import { LogLevelsEnum } from '../../enums/log-levels.enum';

@Service()
export class ErrorsPrinter {
    constructor(private prettyPrinter: PrettyPrinter) {}

    public noArgsPrinter(): void {
        this.baseErrorPrinter();
        this.prettyPrinter.prettyPrint('No args !', true, LogLevelsEnum.ERROR);
        this.prettyPrinter.prettyPrint('Please refer to the helper description below.', true, LogLevelsEnum.ERROR);
        this.baseUsagePrinter();
    }

    private baseUsagePrinter(): void {
        this.prettyPrinter.prettyPrint('Here are the base cli commands: ', true);
        commandsContainer.forEach((command: ICommand, index: number) => {
            this.prettyPrinter.prettyPrint(`${ index + 1 }: ${ command.command }`);
            this.prettyPrinter.prettyPrint(`   Description: ${ command.description }`);
            this.prettyPrinter.prettyPrint(`   Optional command: ${ command.optional }`, true);
        });
    }

    private baseErrorPrinter(): void {
        this.prettyPrinter.emptyLinePrinter();
        this.prettyPrinter.prettyPrint('Sorry, an error occurred: ', true, LogLevelsEnum.ERROR);
    }

}
