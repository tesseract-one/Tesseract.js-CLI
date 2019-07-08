import yargs from 'yargs'
import * as wrapper from './types/wrapper'

export const command = 'create [type]'

export const desc = 'Create something :D'

export const builder = (yargs: yargs.Argv) => (
  yargs
    .command(wrapper)
    .demandCommand(1, 'You need at least one command before moving on')
)

export const handler = (_: yargs.Arguments<{}>) => {}