import  { Task, existsAsync, removeDirAsync } from '../utils'
import { RenderedResult, Config, RenderConfig, RenderArguments } from '../types'
// import path from 'path'
const render = require('hygen/lib/render')
const execute = require('hygen/lib/execute')
const Logger = require('hygen/lib/logger')

type Params = {
  config: Config
  destDirPath: string
  templateDirPath: string
}
type RollbackParams = { destDirPath: string }
type Result = { renderResults: RenderedResult[] }

export class RenderTemplateTask extends Task<Params & RollbackParams, Result> {
  public description = 'Rendering wrapper...'

  async forward({ config, destDirPath, templateDirPath }: Params) {
    const renderArgs: RenderArguments = {
      actionfolder: templateDirPath,
      config: config
    }
    const renderConf: RenderConfig = {
      cwd: destDirPath,
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

  async rollback({ destDirPath }: RollbackParams) {
    if (await existsAsync(destDirPath)) await removeDirAsync(destDirPath)
  }
}