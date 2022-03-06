import { ICliError } from '../../models/error.model';

export const noArgsError: ICliError = {
    error: 'No args',
    description: 'Cli need arguments to work with',
    resolution: 'Please refer to the helper description below',
    addBaseHelper: true,
};
