import { Task, spawnAsync } from '../utils'

type Params = { destDirPath: string }
type Result = {}

export class InstallPodsTask extends Task<Params, Result> {
  async forward({ destDirPath }: Params) {
    await spawnAsync('pod', ['install'], { cwd: destDirPath, stdio: 'inherit'})
    return {}
  }
}

