import { Task, existsAsync, readFileAsync, mergeDeep } from '../utils'
import { CmdConfig, Config } from '../types'
import path from 'path'

type Params = {
  currentDirPath: string
  templatePath?: string
}
type Result = { config: Config }

export class GenerateConfigTask extends Task<Params, Result> {
  private cmdConfig: CmdConfig
  private cliConfig: Config

  constructor(cmdConfig: CmdConfig, cliConfig: Config) {
    super()
    this.cmdConfig = cmdConfig
    this.cliConfig = cliConfig
  }

  async forward({ currentDirPath, templatePath }: Params) {
    // validate json by schema
    const projectConfig = await this.readConfig(currentDirPath, this.cmdConfig.config)

    let config = this.cliConfig

    if (templatePath) {
      const templateConfig = await this.readConfig(templatePath, 'template.config.json')
      config = mergeDeep(config, templateConfig)
    }
    
    config = mergeDeep(config, projectConfig)

    const cmdConfig = {
      appConfig: {},
      template: {}
    } as Config

    if (this.cmdConfig.name) { cmdConfig.name = this.cmdConfig.name }
    if (this.cmdConfig.url) {
      if (!this.cmdConfig.network) { throw new Error('Empty network parameter')}
      cmdConfig.appConfig.dappUrls = {
        appstore: {
          name: 'main',
          netId: this.cmdConfig.network,
          url: this.cmdConfig.url
        }
      }
    }
    if (this.cmdConfig.pods) { cmdConfig.runPodInstall = this.cmdConfig.pods }
    if (this.cmdConfig.out) { cmdConfig.outputDir = this.cmdConfig.out }
    if (this.cmdConfig.template) { cmdConfig.template.path = this.cmdConfig.template }
    if (this.cmdConfig.rpc) {
      if (!this.cmdConfig.network) { throw new Error('Empty network parameter')}
      cmdConfig.appConfig.rpcUrls = {
        [this.cmdConfig.network]: this.cmdConfig.rpc
      }
    }

    config = mergeDeep(config, cmdConfig)

    return { config }
  }

  private async readConfig(folder: string, name: string): Promise<{[key: string]: any}> {
    const fullPath = path.isAbsolute(name) ? name : path.join(folder, name)
    folder = path.dirname(fullPath)
    if (!await existsAsync(fullPath)) { return {} }

    const data = await readFileAsync(fullPath)
    const config: Config = JSON.parse(data.toString())

    if (config.template && config.template.resources) {
      for (const key in config.template.resources) {
        const rPath = config.template.resources[key]
        config.template.resources[key] = path.isAbsolute(rPath) ? rPath : path.join(folder, rPath)
      }
    }

    return config
  }
}
