import { ICliError } from '../../models/error.model';

export const unknownArgsError: ICliError = {
    error: 'unknown args',
    description: 'the arguments you\'ve passed in are not recognized.',
    resolution: 'please refer to the helper description below',
    addBaseHelper: true,
};
