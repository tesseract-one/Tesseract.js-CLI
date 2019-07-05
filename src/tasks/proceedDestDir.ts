import  { Task, removeDirAsync, existsAsync } from '../utils'
import path from 'path'
import { Config } from '../types'

type Params = {
  config: Config
  currentDirPath: string
}
type Result = { destDirPath: string }

export class ProceedDestDirTask extends Task<Params, Result> {
  async forward({ config, currentDirPath }: Params) {
    const destDirPath = path.join(currentDirPath, config.outputDir, config.name)
    const isExistDestDir = await existsAsync(destDirPath)
    if (isExistDestDir) await removeDirAsync(destDirPath)
    return { destDirPath }
  }
}