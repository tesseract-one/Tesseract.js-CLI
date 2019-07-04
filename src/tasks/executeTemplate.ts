import  { Task } from '../utils'
import { RenderedAction, RenderedResult, RenderArguments, RenderConfig } from '../types'
const execute = require('hygen/lib/execute')

type Params = {
  args: RenderArguments,
  config: RenderConfig,
  renderedActions: RenderedAction[],
}

type Result = { renderedResults: RenderedResult[] }

export class ExecuteTemplateTask extends Task<Params, Result> {
  async forward({ args, config, renderedActions }: Params) {
    const renderedResults = await execute(renderedActions, args, config)
    return { renderedResults }
  }
}
