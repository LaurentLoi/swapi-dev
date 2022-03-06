import { IFilm } from '../../../shared/models/swapi-film.model';
import { LogLevelsEnum } from '../../enums/log-levels.enum';
import { PrettyPrinter } from './pretty.printer';
import { IPlanet } from '../../../shared/models/swapi-planet.model';
import { PlanetPrinter } from './planet.printer';
import { Service } from 'typedi';

@Service()
export class FilmPrinter {

    constructor(private prettyPrinter: PrettyPrinter, private planetPrinter: PlanetPrinter) {}

    public printFilm(film: IFilm, filmNbr: number): void {
        this.prettyPrinter.prettyPrint(`Film ${ filmNbr } title: `, false, LogLevelsEnum.SUCCESS, 1);
        this.prettyPrinter.prettyPrint(film.title, true, LogLevelsEnum.FANCY, 2);
        this.prettyPrinter.prettyPrint(`Number of planets: `, false, LogLevelsEnum.SUCCESS, 1);
        this.prettyPrinter.prettyPrint(film.planets.length.toString(), true, LogLevelsEnum.FANCY, 2);
    }

    public printFilmPlanets(planets: IPlanet[]): void {
        this.prettyPrinter.prettyPrint('Planets name: ', true, LogLevelsEnum.SUCCESS, 1);
        planets.forEach((planet: IPlanet) => {
            this.planetPrinter.printPlanetName(planet.name);
        });
        this.prettyPrinter.emptyLinePrinter();
    }
}
