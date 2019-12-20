import { Task, waitTillExit, removeDirAsync, unlinkAsync, existsAsync } from '../utils'
import { spawn } from 'child_process'
import path from 'path'

type Params = { destDirPath: string }
type Result = {}

export class InstallPodsTask extends Task<Params, Result> {
  public description = 'Installing pods...'

  async forward({ destDirPath }: Params) {
    await waitTillExit(spawn('pod', ['install'], { cwd: destDirPath, stdio: 'inherit'}))
    return {}
  }

  async rollback({ destDirPath }: { destDirPath: string }) {
    const podsDirPath = path.join(destDirPath, './Pods')
    const podfileDirPath = path.join(destDirPath, './Podfile.lock' )
    if (await existsAsync(podsDirPath)) await removeDirAsync(podsDirPath)
    if (await existsAsync(podfileDirPath)) await unlinkAsync(podfileDirPath)
  }
}
