import path from 'path'
import  { Task, unlinkAsync, existsAsync } from '../utils'
import { Constants } from '../types'
const appIcon = require('app-icon')

type Params = {
  templateDirPath: string
  currentDirPath: string
  destDirPath: string
  constants: Constants
}
type Result = { isSetAppIcon: boolean }

export class SetAppIcon extends Task<Params, Result> {
  async forward({ templateDirPath, currentDirPath, destDirPath, constants }: Params) {
    let isSetAppIcon: boolean
    const isCustomAppIcon = await existsAsync(path.join(currentDirPath, constants.appIconFileName))
    const appIconPath = isCustomAppIcon
      ? path.join(currentDirPath, constants.appIconFileName)
      : path.join(templateDirPath, 'defaults', constants.appIconFileName)

    try {
      await appIcon.generate({
        sourceIcon: appIconPath,
        platforms: 'ios',
        searchRoot: destDirPath,
      })
      isSetAppIcon = true
    } catch (err) {
      console.error(`Error, app icon wasn\'t set. ${err}`)
      isSetAppIcon = false
    }

    if (isCustomAppIcon) {
      try {
        await unlinkAsync(path.join(appIconPath))
      } catch (err) {
        console.error(`Error, app icon wasn\'t deleted. ${err}`)
      }
    }

    return { isSetAppIcon }
  }
}