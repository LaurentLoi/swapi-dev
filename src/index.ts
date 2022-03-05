#!/usr/bin/env ts-node

import { Container } from 'typedi';
import { Cli } from './cli/cli';

(() => {
    Container.get(Cli).run().then();
})();
