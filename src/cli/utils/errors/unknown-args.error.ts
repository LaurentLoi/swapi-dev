import { ICliError } from '../../models/error.model';

export const unknownArgsError: ICliError = {
    error: 'Unknown args',
    description: 'The arguments you\'ve passed in are not recognized.',
    resolution: 'Please refer to the helper description below',
    addBaseHelper: true,
};
