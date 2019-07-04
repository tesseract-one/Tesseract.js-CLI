import path from 'path'
import { Task, spawnAsync } from '../utils'

type Params = { currentDirPath: string }
type Result = { templateDirPath: string }

export class GetTemplateDirPathTask extends Task<Params, Result> {
  private templatePath: string
  private templateDirName = 'template'

  constructor(templatePath: string) {
    super()
    this.templatePath = templatePath
  }

  async forward({ currentDirPath }: Params) {
    let templateUrl: URL | null = null
    let templateDirPath: string

    try { templateUrl = new URL(this.templatePath) }
    catch {}

    if (templateUrl !== null) {
      await spawnAsync('git', ['clone', templateUrl.href, this.templateDirName], { stdio: 'inherit' })
      templateDirPath = path.join(currentDirPath, this.templateDirName)
    } else {
      templateDirPath = path.join(currentDirPath, this.templatePath)
    }

    return { templateDirPath }
  }
}


