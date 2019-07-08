import { CommandModule } from 'yargs'
import * as create from './create'

const allCommands: CommandModule<{}, {}>[] = [
  create
]

export default allCommands