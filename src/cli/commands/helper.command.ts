import { ICommand } from '../models/command.model';

export const helperCommand: ICommand = {
    command: '[h | help]',
    description: 'Prints the CLI helper',
    optional: false,
    exampleUsage: 'help',
};
