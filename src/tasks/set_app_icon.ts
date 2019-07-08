import  { Task, readdirAsync, unlinkAsync } from '../utils'
import { Config } from '../types'
import path from 'path'
import pascalCase = require('pascal-case')
const appIcon = require('app-icon')

type Params = {
  config: Config
  destDirPath: string
}
type Result = {}

export class SetAppIconTask extends Task<Params, Result> {
  public description = 'Generating app icon...'

  async forward({ config, destDirPath }: Params) {
    const appIconPath = config.template.resources.appIcon

    await appIcon.generate({
      sourceIcon: appIconPath,
      platforms: 'ios',
      searchRoot: destDirPath,
    })

    return {}
  }

  async rollback({ config, destDirPath }: Params) {
    const iconsDirPath = path.join(
      destDirPath,
      pascalCase(config.name),
      'Images.xcassets',
      'AppIcon.appiconset',
    )
    const files = await readdirAsync(iconsDirPath)
    const icons = files.filter(file => file.endsWith('.png'))
    await Promise.all(icons.map(icon => unlinkAsync(path.join(iconsDirPath, icon))))
  }
}