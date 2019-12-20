import yargs from 'yargs'
import { Runner } from '../../../../utils'
import { CmdConfig } from '../../../../types'
import validationScheme from './config_scheme.json'
import * as Tasks from '../../../../tasks'

export const command = 'wrapper [name]'
// export const aliases = ['w']
export const desc = 'Generate ios wrapper for your web hosted dApp'

export const builder = (yargs: yargs.Argv) => (
  yargs.option('name', {
    alias: 'n',
    describe: 'Name of the dApp',
    type: 'string'
  })
  .option('url', {
    alias: 'u',
    describe: 'Url of the dApp',
    type: 'string'
  })
  .option('rpc', {
    alias: 'r',
    describe: 'Url of Ethereum RPC',
    type: 'string'
  })
  .option('template', {
    alias: 't',
    describe: 'Path to template, also can be url',
    default: 'https://github.com/tesseract-one/WrapperTemplate-iOS.git',
    type: 'string'
  })
  .option('out', {
    alias: 'o',
    describe: 'Output directory',
    type: 'string'
  })
  .option('pods', {
    alias: 'p',
    describe: 'Run pod install after generation',
    default: true,
    type: 'boolean'
  })
  .option('config', {
    alias: 'c',
    describe: 'Path to config file',
    type: 'string'
  })
  .option('app-id', {
    alias: 'i',
    describe: 'Bundle and package id of aplication',
    type: 'string'
  })
  .help()
)

export const handler = async (cmdConfig: yargs.Arguments<CmdConfig>) => {
  new Runner({ currentDirPath: process.cwd()})
    .add(new Tasks.GenerateConfigTask(cmdConfig, validationScheme))
    .add(new Tasks.GetTemplateDirPathTask())
    .add(new Tasks.GenerateConfigTask(cmdConfig, validationScheme))
    .add(new Tasks.CleanDestDirTask())
    .add(new Tasks.RenderTemplateTask())
    .add(new Tasks.SetSpashImageTask())
    .add(new Tasks.SetAppIconTask())
    .add(new Tasks.InstallPodsTask())
    .run()
}