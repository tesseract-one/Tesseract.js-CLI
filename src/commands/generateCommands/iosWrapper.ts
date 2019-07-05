import yargs from 'yargs'
import { Runner } from '../../utils'
import { CmdConfig, Config } from '../../types'
import cliConfig from '../../cli.config.json'
import * as Tasks from '../../tasks'

export const command = 'ios-wrapper [name] [url] [rpc] [template] [out] [pods]'
export const aliases = ['iw']
export const desc = 'Generate ios wrapper for your web-app.'
export const builder = (yargs: yargs.Argv) => (
  yargs.option('name', {
    alias: 'n',
    describe: 'Name of the app.',
    type: 'string'
  })
  .option('url', {
    alias: 'u',
    describe: 'Url of the web site.',
    type: 'string'
  })
  .option('rpc', {
    alias: 'r',
    describe: 'Url of RPC.',
    type: 'string'
  })
  .option('template', {
    alias: 't',
    describe: 'Path to template, also can be url.',
    type: 'string'
  })
  .option('out', {
    alias: 'o',
    describe: 'Output directory.',
    type: 'string'
  })
  .option('pods', {
    alias: 'p',
    describe: 'Should pods be installed or not.',
    type: 'boolean'
  })
  .option('config', {
    alias: 'c',
    describe: 'Path to config file.',
    default: './project-config.json',
    type: 'string'
  })
  .help()
)

export const handler = async (cmdConfig: yargs.Arguments<CmdConfig>) => {
  new Runner({ currentDirPath: process.cwd()})
    .add(new Tasks.GenerateConfigTask(cmdConfig, cliConfig as Config))
    .add(new Tasks.GetTemplateDirPathTask())
    .add(new Tasks.CheckTemplateDirTask())
    .add(new Tasks.GenerateConfigTask(cmdConfig, cliConfig as Config))
    .add(new Tasks.ProceedDestDirTask())
    .add(new Tasks.RenderTemplateTask())
    .add(new Tasks.ExecuteTemplateTask())
    .add(new Tasks.SetSpashImageTask())
    .add(new Tasks.SetAppIcon())
    .add(new Tasks.InstallPodsTask())
    .run()
}