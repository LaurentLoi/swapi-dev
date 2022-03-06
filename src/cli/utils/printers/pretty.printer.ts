import { Service } from 'typedi';
import { LogLevelsEnum } from '../../enums/log-levels.enum';
import { CliColorsEnum } from '../../enums/cli-colors.enum';
import { TITLE_BIG, TITLE_SMALL } from '../title';

@Service()
export class PrettyPrinter {

    public logLevel: LogLevelsEnum = LogLevelsEnum.INFO;

    private cmdWidth: number = process.stdout.columns;
    private tabsLength = 4;
    private prependLength = 4;
    private appendLength = 2;

    private lineAvailableLength: number = this.cmdWidth - this.prependLength - this.appendLength;

    private baseColor = CliColorsEnum.WHITE;
    private decorationColor = CliColorsEnum.CYAN;
    private resetColor = CliColorsEnum.RESET;

    public emptyLinePrinter(): void {
        this.prettyPrint('');
    }

    public cliDelimiter(position?: 'start' | 'end'): void {
        let content = '';
        for (let i = 0; i < (this.cmdWidth - this.appendLength); i++) {
            content += '═';
        }
        if (!position || position === 'start') {
            console.log(`${ this.decorationColor }╔${ content }╗${ this.resetColor }`);
        } else {
            console.log(`${ this.decorationColor }╚${ content }╝${ this.resetColor }`);
        }
    }

    public cliTitlePrinter(): void {
        if (this.lineAvailableLength >= TITLE_BIG[0].length) {
            this.prettyPrint(TITLE_BIG, false, LogLevelsEnum.FANCY);
        } else {
            this.prettyPrint(TITLE_SMALL, false, LogLevelsEnum.FANCY);
        }
        this.prettyPrint('Another Star Wars API CLI.', true, LogLevelsEnum.SUCCESS, 1);
    }

    public prettyPrint(toPrint: string | string[], emptyLine?: boolean, logLevel?: LogLevelsEnum, tabs?: number): void {

        this.setPrinterParams(logLevel);

        if (Array.isArray(toPrint)) {
            toPrint.forEach((line: string) => {
                this.print(line, tabs || 0);
            });
        } else {
            this.print(toPrint, tabs || 0);
        }
        if (emptyLine) {
            this.emptyLinePrinter();
        }
    }

    private print(toPrint: string, tabs: number): void {
        if ((tabs * this.tabsLength) + toPrint.length < this.lineAvailableLength) {
            this.linePrinter(this.tabsGenerator(tabs) + toPrint);
        } else {
            this.lineChunck(toPrint, tabs).forEach((chunk: string) => {
                this.linePrinter(this.tabsGenerator(tabs) + chunk);
            });
        }
    }

    private linePrinter(line: string): void {
        console.log(`${ this.startOfLine() } ${ this.baseColor } ${ line } ${ this.endOfLine(line.length) }${ this.resetColor }`);
    }

    private lineChunck(line: string, tabs?: number): RegExpMatchArray {
        return (line.match(new RegExp('.{1,' + (this.lineAvailableLength - (tabs ? tabs * this.tabsLength : 0)) + '}', 'g'))) || [];
    }

    private startOfLine(): string {
        return `${ this.decorationColor }║${ this.resetColor }`;
    }

    private endOfLine(length: number): string {
        return ' '.repeat(this.lineAvailableLength - length) + `${ this.decorationColor } ║${ this.resetColor }`;
    }

    private tabsGenerator(tabsNbr: number): string {
        return '    '.repeat(tabsNbr);
    }

    private setPrinterParams(logLevel?: LogLevelsEnum): void {
        if (logLevel && logLevel !== LogLevelsEnum.INFO) {
            this.logLevel = logLevel;
        } else {
            this.logLevel = LogLevelsEnum.INFO;
        }

        switch (this.logLevel) {
        case LogLevelsEnum.INFO:
            this.baseColor = CliColorsEnum.WHITE;
            break;
        case LogLevelsEnum.ERROR:
            this.baseColor = CliColorsEnum.RED;
            break;
        case LogLevelsEnum.SUCCESS:
            this.baseColor = CliColorsEnum.GREEN;
            break;
        case LogLevelsEnum.FANCY:
            this.baseColor = CliColorsEnum.CYAN;
            break;
        case LogLevelsEnum.ALERT:
            this.baseColor = CliColorsEnum.YELLOW;
            break;
        }
    }
}
