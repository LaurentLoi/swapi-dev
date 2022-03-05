import { Service } from 'typedi';

@Service()
export class CliArgsParserService {
    public getParsedArgs(): string[] {
        return process.argv.slice(2);
    }
}
