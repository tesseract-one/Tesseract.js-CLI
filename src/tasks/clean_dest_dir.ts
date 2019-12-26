import { Task, removeDirAsync, existsAsync } from '../utils'
import path from 'path'
import { Config } from '../types'

type Params = {
  config: Config
  currentDirPath: string
}
type Result = { destDirPath: string }

export class CleanDestDirTask extends Task<Params, Result> {
  public description = 'Cleaning destination directory...'

  async forward({ config, currentDirPath }: Params) {
    const destDirPath = path.isAbsolute(config.outputDir)
      ? config.outputDir
      : path.join(currentDirPath, config.outputDir)
    const isExistDestDir = await existsAsync(destDirPath)
    if (isExistDestDir) await removeDirAsync(destDirPath)
    return { destDirPath }
  }
}