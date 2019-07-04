import  { Task, existsAsync } from '../utils'

type Params = { templateDirPath: string }
type Result = { isTemplateDirExist: boolean }

export class CheckTemplateDirTask extends Task<Params, Result> {
  async forward(params: Params) {
    const isTemplateDirExist = await existsAsync(params.templateDirPath)
    return { isTemplateDirExist }
  }
}