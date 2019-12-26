import { Task, existsAsync, readFileAsync, deepMerge } from '../utils'
import { CmdConfig, Config } from '../types'
import path from 'path'
import Ajv from "ajv"
const ajvAsync = require("ajv-async")(new Ajv)

const WRAPPER_CONFIG_DEFAULT_PATH = './wrapper.config.json'
const TEMPLATE_CONFIG_FILE_NAME = 'template.config.json'

type Params = {
  currentDirPath: string
  templateDirPath?: string
}
type Result = { config: Config }

export class GenerateConfigTask extends Task<Params, Result> {
  public description = 'Generating config...'
  private cmdConfig: CmdConfig
  private validationScheme: Object
  private defaults: Partial<Config>

  constructor(defaults: Partial<Config>, cmdConfig: CmdConfig, validationScheme: Object) {
    super()
    this.cmdConfig = cmdConfig
    this.defaults = defaults
    this.validationScheme = validationScheme
  }

  async forward({ currentDirPath, templateDirPath }: Params) {
    const wrapperConfig = await this.loadWrapperConfig(currentDirPath)
    const cmdConfig = {
      appConfig: {
        extra: {}
      },
      template: {}
    } as Config

    if (this.cmdConfig.name) { cmdConfig.name = this.cmdConfig.name }
    if (this.cmdConfig.url) {
      cmdConfig.appConfig.dappUrls = {
        default: [{
          name: 'main',
          url: this.cmdConfig.url
        }],
        testing: []
      }
    }
    if (this.cmdConfig.pods) { cmdConfig.runPodInstall = this.cmdConfig.pods }
    if (this.cmdConfig.out) { cmdConfig.outputDir = this.cmdConfig.out }
    if (this.cmdConfig.template) { cmdConfig.template.path = this.cmdConfig.template }
    if (this.cmdConfig.appId) { 
      cmdConfig.template.appId = {
        ios: this.cmdConfig.appId
      }
    }
    if (this.cmdConfig.rpc) {
      cmdConfig.appConfig.rpcUrls = {
        "1": this.cmdConfig.rpc
      }
    }

    let config = deepMerge(wrapperConfig, cmdConfig)
    config = deepMerge(this.defaults, config)

    if (templateDirPath) {
      const templateConfig = await this.readConfig(templateDirPath, TEMPLATE_CONFIG_FILE_NAME)
      config = deepMerge(templateConfig, config)
    }

    await this.validateConfig(config)
  
    return { config }
  }

  private async loadWrapperConfig(currentDirPath: string): Promise<{[key: string]: any}> {
    let wrapperConfigPath = WRAPPER_CONFIG_DEFAULT_PATH
    if (this.cmdConfig.config) {
      const absWrapperConfigPath = path.isAbsolute(this.cmdConfig.config)
        ? this.cmdConfig.config
        : path.join(currentDirPath, this.cmdConfig.config)
      if (!await existsAsync(absWrapperConfigPath)) throw Error('Incorrect path to config file.')
      wrapperConfigPath = this.cmdConfig.config
    }
    return await this.readConfig(currentDirPath, wrapperConfigPath)
  }

  private async readConfig(dir: string, name: string): Promise<{[key: string]: any}> {
    const fullPath = path.isAbsolute(name) ? name : path.join(dir, name)
    dir = path.dirname(fullPath)
    if (!await existsAsync(fullPath)) { return {} }

    const data = await readFileAsync(fullPath)
    const config: Config = JSON.parse(data.toString())

    if (config.outputDir) {
      config.outputDir = path.isAbsolute(config.outputDir)
        ? config.outputDir
        : path.join(dir, config.outputDir)
    }
    
    if (config.template && config.template.resources) {
      for (const key in config.template.resources) {
        const rPath = config.template.resources[key]
        config.template.resources[key] = path.isAbsolute(rPath) ? rPath : path.join(dir, rPath)
      }
    }

    return config
  }

  private async validateConfig(config: Config) {
    const validate = ajvAsync.compile(this.validationScheme)
    try {
      await validate(config)
    } catch (err) {
      if(!(err instanceof Ajv.ValidationError)) {
        throw new Error(`Required config parameters weren\'t provided. ${err}`)
      }
      throw new Error(
        `Required config parameters weren\'t provided.\n${err.errors.map(err => JSON.stringify(err, null, 2))}`
      )
    }
  }
}
