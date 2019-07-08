import  { Task, removeDirAsync, existsAsync } from '../utils'
import path from 'path'
import { Config } from '../types'
import { paramCase } from 'change-case'

type Params = {
  config: Config
  currentDirPath: string
}
type Result = { destDirPath: string }

export class RemoveDestDirTask extends Task<Params, Result> {
  async forward({ config, currentDirPath }: Params) {
    const destDirPath = path.join(currentDirPath, config.outputDir, paramCase(config.name))
    const isExistDestDir = await existsAsync(destDirPath)
    if (isExistDestDir) await removeDirAsync(destDirPath)
    return { destDirPath }
  }
}