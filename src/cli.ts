#!/usr/bin/env node
import yargs from 'yargs'

yargs
  .commandDir('commands')
  .demandCommand(1, 'You need at least one command before moving on')
  .argv