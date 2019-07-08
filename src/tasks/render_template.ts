import  { Task } from '../utils'
import { RenderedResult, Config, RenderConfig, RenderArguments } from '../types'
const render = require('hygen/lib/render')
const execute = require('hygen/lib/execute')
const Logger = require('hygen/lib/logger')

type Params = {
  config: Config
  currentDirPath: string
  templateDirPath: string
}
type Result = { renderResults: RenderedResult[] }

export class RenderTemplateTask extends Task<Params, Result> {
  async forward({ config, currentDirPath, templateDirPath }: Params) {
    const renderArgs: RenderArguments = {
      cwd: currentDirPath,
      actionfolder: templateDirPath,
      config: config
    }
    const renderConf: RenderConfig = {
      cwd: currentDirPath,
      logger: new Logger(console.log.bind(console)),
      createPrompter: () => require('enquirer'),
      helpers: {
        jsonString: (obj: any, min: boolean) => JSON.stringify(obj, null, min ? undefined : 4)
      },
      debug: !!process.env.DEBUG
    }
    const renderActions = await render(renderArgs, renderConf)
    const renderResults = await execute(renderActions, renderArgs, renderConf)
    return { renderResults }
  }
}