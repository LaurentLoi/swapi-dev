import { ICommand } from '../models/command.model';

export const swapiBaseCommand: ICommand = {
    command: '[Star Wars movie number from 1 to 7]',
    description: 'Prints the total diameter of the planets with mountains and water surfaces for a given movie number.',
    optional: false,
    exampleUsage: '6',
    optionalCommands: [
        {
            command: 'w',
            description: 'So you speak Wookiee ?! That\'s great !',
            optional: true,
            exampleUsage: '6 w',
        },
    ],
};
