import { Service } from 'typedi';
import { LogLevelsEnum } from '../../enums/log-levels.enum';
import { CliColorsEnum } from '../../enums/cli-colors.enum';

@Service()
export class PrettyPrinter {

    public logLevel: LogLevelsEnum = LogLevelsEnum.INFO;

    private cmdWidth: number = process.stdout.columns;
    private lineAvailableLength: number = this.cmdWidth - 5;

    private baseColor = CliColorsEnum.WHITE;
    private decorationColor = CliColorsEnum.CYAN;
    private resetColor = CliColorsEnum.RESET;

    public emptyLinePrinter(): void {
        console.log(this.lineDelimiter());
    }

    public cliDelimiter(position?: 'start' | 'end'): void {
        let content = '';
        for (let i = 0; i < this.lineAvailableLength - 1; i++) {
            content += '═';
        }
        if (!position || position === 'start') {
            console.log(`${ this.decorationColor }╔${ content }${ this.resetColor }`);
        } else {
            console.log(`${ this.decorationColor }╚${ content }${ this.resetColor }`);
        }
    }

    public prettyPrint(toPrint: string | string[], emptyLine?: boolean, logLevel?: LogLevelsEnum): void {

        this.setBaseParams(logLevel);

        if (Array.isArray(toPrint)) {
            toPrint.forEach((line: string) => {
                this.print(line);
            });
        } else {
            this.print(toPrint);
        }
        if (emptyLine) {
            this.emptyLinePrinter();
        }
    }

    private print(toPrint: string): void {
        if (toPrint.length < this.lineAvailableLength) {
            this.linePrinter(toPrint);
        } else {
            this.lineChunck(toPrint).forEach((chunk: string) => {
                this.linePrinter(chunk);
            });
        }
    }

    private linePrinter(line: string): void {
        console.log(`${ this.lineDelimiter() }  ${ this.baseColor }> ${ line }${ this.resetColor }`);
    }

    private lineChunck(line: string): string[] {
        return (line.match(`/.{1,${ this.lineAvailableLength }}/g`) || ['']);
    }

    private lineDelimiter(): string {
        return `${ this.decorationColor }║${ this.resetColor }`;
    }

    private setBaseParams(logLevel?: LogLevelsEnum): void {
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
        }
    }
}
