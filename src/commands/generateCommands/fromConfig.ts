import yargs from 'yargs'
import { runTasks } from '../../utils'

export const command = 'from-config'
export const aliases = ['fc']
export const desc = 'Use json config file to configure generated app'
export const builder = (yargs: yargs.Argv) => {
  const fs = require('fs')
  const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
  return yargs.config(config)
}
export const handler = runTasks