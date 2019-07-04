import yargs from 'yargs'

export const command = 'generate'
export const aliases = ['gen']
export const desc = 'Generate IOS app for your site'
export const builder = (yargs: yargs.Argv) => (
  yargs.commandDir('generateCommands')
  .demandCommand(1, 'You need at least one command before moving on')
)
export const handler = (_: yargs.Argv) => {}