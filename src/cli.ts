#!/usr/bin/env node
import yargs from 'yargs'
import commands from './commands'

let cli = yargs

for (const command of commands) {
  cli = cli.command(command)
}

yargs
  .commandDir('commands')
  .demandCommand(1, 'You need at least one command before moving on')
  .argv