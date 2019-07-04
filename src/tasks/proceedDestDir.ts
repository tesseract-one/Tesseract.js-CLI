import  { Task, removeDirAsync, existsAsync } from '../utils'
import path from 'path'

type Params = { currentDirPath: string }
type Result = { destDirPath: string }

export class ProceedDestDirTask extends Task<Params, Result> {
  private destDirName: string

  constructor(destDirName: string) {
    super()
    this.destDirName = destDirName
  }

  async forward({ currentDirPath }: Params) {
    const destDirPath = path.join(currentDirPath, this.destDirName)
    const isExistDestDir = await existsAsync(destDirPath)
    if (isExistDestDir) await removeDirAsync(destDirPath)
    return { destDirPath }
  }
}