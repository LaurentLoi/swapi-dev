export interface ICommand {
    command: string;
    description: string;
    optional: boolean;
    exampleUsage: string;
    optionalCommands?: ICommand[];
}
