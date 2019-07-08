import { Task, waitTillExit } from '../utils'
import { spawn } from 'child_process'

type Params = { destDirPath: string }
type Result = {}

export class InstallPodsTask extends Task<Params, Result> {
  async forward({ destDirPath }: Params) {
    await waitTillExit(spawn('pod', ['install'], { cwd: destDirPath, stdio: 'inherit'}))
    return {}
  }
}

