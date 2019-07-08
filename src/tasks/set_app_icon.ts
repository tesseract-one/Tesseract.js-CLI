import  { Task } from '../utils'
import { Config } from '../types'
const appIcon = require('app-icon')

type Params = {
  config: Config
  templateDirPath: string
  currentDirPath: string
  destDirPath: string
}
type Result = {}

export class SetAppIconTask extends Task<Params, Result> {
  async forward({ config, destDirPath }: Params) {
    const appIconPath = config.template.resources.appIcon

    await appIcon.generate({
      sourceIcon: appIconPath,
      platforms: 'ios',
      searchRoot: destDirPath,
    })

    return {}
  }
}