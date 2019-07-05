import  { Task } from '../utils'
import { RenderedAction, RenderedResult, RenderArguments, RenderConfig } from '../types'
const execute = require('hygen/lib/execute')

type Params = {
  renderArgs: RenderArguments,
  renderConf: RenderConfig,
  renderedActions: RenderedAction[],
}

type Result = { renderedResults: RenderedResult[] }

export class ExecuteTemplateTask extends Task<Params, Result> {
  async forward({ renderArgs, renderConf, renderedActions }: Params) {
    const renderedResults = await execute(renderedActions, renderArgs, renderConf)
    return { renderedResults }
  }
}
