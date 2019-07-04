import yargs from 'yargs'
import { runTasks } from '../../utils'

export const command = 'from-inline-params [name] [url] [isLightTexts] [statusBarColor]'
export const aliases = ['fi']
export const desc = 'Use inline parameters to configure generated app'
export const builder = (yargs: yargs.Argv) => (
  yargs.option('name', {
    alias: 'n',
    describe: 'Name of app',
    type: 'string'
  })
  .option('url', {
    alias: 'u',
    describe: 'Url of web site',
    type: 'string'
  })
  .option('isLightTexts', {
    alias: 'il',
    describe: 'Texts on status bar could be white or dark',
    default: false,
    type: 'boolean'
  })
  .option('statusBarColor', {
    alias: 'sc',
    default: '#ffffff',
    describe: 'Backgraund color of status bar',
    type: 'string'
  })
  .demandOption(['name', 'url'])
  .help()
)
export const handler = runTasks