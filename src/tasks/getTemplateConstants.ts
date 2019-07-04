import { Task, readFileAsync } from '../utils'
import { Constants } from '../types'
import path from 'path'

type Params = { templateDirPath: string }
type Result = { constants: Constants }

export class GetTemplateConstants extends Task<Params, Result> {
  async forward({ templateDirPath }: Params) {
    const rawConstants = await readFileAsync(path.join(templateDirPath, 'defaults/constants.json'))
    const constants: Constants = JSON.parse(rawConstants.toString())
    return { constants }
  }
}


