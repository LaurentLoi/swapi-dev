import { IFilm, IWookieeFilm } from '../../../shared/models/swapi-film.model';
import { LogLevelsEnum } from '../../enums/log-levels.enum';
import { PrettyPrinter } from './pretty.printer';
import { IPlanet, IWookieePlanet } from '../../../shared/models/swapi-planet.model';
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

    public printWookieFilm(film: IWookieeFilm, filmNbr: number): void {
        this.prettyPrinter.prettyPrint(`Raaaaaahhgh uughghhhgh ${ filmNbr } awwgggghhh: `, false, LogLevelsEnum.SUCCESS, 1);
        this.prettyPrinter.prettyPrint(film.aoahaoanwo, true, LogLevelsEnum.FANCY, 2);
        this.prettyPrinter.prettyPrint(`uughguughhhghghghhhgh huuguughghg raaaaaahhgh uughguughhhghghghhhgh: `, false,
            LogLevelsEnum.SUCCESS, 1);
        this.prettyPrinter.prettyPrint(film.akanrawhwoaoc.length.toString(), true, LogLevelsEnum.FANCY, 2);
    }

    public printFilmPlanets(planets: IPlanet[]): void {
        this.prettyPrinter.prettyPrint('Planets name: ', true, LogLevelsEnum.SUCCESS, 1);
        planets.forEach((planet: IPlanet) => {
            this.planetPrinter.printPlanetName(planet.name);
        });
        this.prettyPrinter.emptyLinePrinter();
    }

    public printWookieFilmPlanets(planets: IWookieePlanet[]): void {
        this.prettyPrinter.prettyPrint('uughghhhgh uuh raaaaaahhgh: ', true, LogLevelsEnum.SUCCESS, 1);
        planets.forEach((planet: IWookieePlanet) => {
            this.planetPrinter.printPlanetName(planet.whrascwo);
        });
        this.prettyPrinter.emptyLinePrinter();
    }
}
