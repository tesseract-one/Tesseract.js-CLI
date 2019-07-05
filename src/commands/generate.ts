import yargs from 'yargs'

export const command = 'generate [ios-wrapper]'
export const aliases = ['g']
export const desc = 'Generate something :D'
export const builder = (yargs: yargs.Argv) => (
  yargs.commandDir('generateCommands')
  .demandCommand(1, 'You need at least one command before moving on')
)
export const handler = (_: yargs.Argv) => {}