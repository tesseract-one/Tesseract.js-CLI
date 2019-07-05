import  { Task, existsAsync } from '../utils'

type Params = { templateDirPath: string }
type Result = {}

export class CheckTemplateDirTask extends Task<Params, Result> {
  async forward({ templateDirPath }: Params) {
    if(!await existsAsync(templateDirPath)) {
      throw Error('Error, can\'t find template directory.')
    }
    return {}
  }
}