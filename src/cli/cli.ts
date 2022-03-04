import 'reflect-metadata';
import { Service } from 'typedi';

@Service()
export class Cli {

    public run(): void {
        console.log('Hello world from base cli app !');
    }

}
