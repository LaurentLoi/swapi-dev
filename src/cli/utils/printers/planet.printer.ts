import { LogLevelsEnum } from '../../enums/log-levels.enum';
import { PrettyPrinter } from './pretty.printer';
import { Service } from 'typedi';

@Service()
export class PlanetPrinter {

    constructor(private prettyPrinter: PrettyPrinter) {}

    public printPlanetName(planetName: string): void {
        this.prettyPrinter.prettyPrint(planetName, false, LogLevelsEnum.FANCY, 2);
    }

    public printPlanetDiameter(diameter: number, wookie?: boolean): void {
        this.prettyPrinter.prettyPrint(`${ wookie ? 'Aaahnruh uggguh' : 'Diameter' }: ${ diameter }`, true, LogLevelsEnum.FANCY, 2);
    }
}
