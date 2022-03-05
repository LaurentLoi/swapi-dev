import { ICliError } from '../../models/error.model';

export const noArgsError: ICliError = {
    error: 'no args',
    description: 'cli need arguments to work with',
    resolution: 'please refer to the helper description below',
    addBaseHelper: true,
};
