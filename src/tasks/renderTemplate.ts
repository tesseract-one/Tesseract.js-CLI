import  { Task, hexToRgb } from '../utils'
import { RenderedAction, GenerationParams, RenderConfig, RenderArguments, Constants } from '../types'
const render = require('hygen/lib/render')
const Logger = require('hygen/lib/logger')

type Params = {
  currentDirPath: string
  templateDirPath: string
  constants: Constants
}
type Result = { 
  renderedActions: RenderedAction[]
  args: RenderArguments
  config: RenderConfig
}

export class RenderTemplateTask extends Task<Params, Result> {
  private generationParams: GenerationParams

  constructor(generationParams: GenerationParams) {
    super()
    this.generationParams = generationParams
  }

  async forward({ currentDirPath, templateDirPath, constants }: Params) {
    const statusBarColor = hexToRgb(this.generationParams.statusBarColor) || hexToRgb(constants.statusBarColor)!
    const statusBarStyle = this.generationParams.isLightStatusBar ? '.lightContent' : '.darkContent'
    const args: RenderArguments = {
      cwd: currentDirPath,
      actionfolder: templateDirPath,
      name: this.generationParams.name,
      url: this.generationParams.url,
      barStyle: statusBarStyle,
      red: statusBarColor.r,
      green: statusBarColor.g,
      blue: statusBarColor.b
    }
    const config: RenderConfig = {
      cwd: currentDirPath,
      logger: new Logger(console.log.bind(console)),
      createPrompter: () => require('enquirer'),
      exec: (action: any, body: any) => {
        const opts = body && body.length > 0 ? { input: body } : {}
        return require('execa').shell(action, opts)
      },
      debug: !!process.env.DEBUG
    }
    const renderedActions = await render(args, config)
    return { renderedActions, args, config }
  }
}