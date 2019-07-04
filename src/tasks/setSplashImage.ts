import path from 'path'
import changeCase from 'change-case'
import  { Task, existsAsync, renameAsync, copyFileAsync } from '../utils'
import { Constants } from '../types'

type Params = {
  templateDirPath: string
  currentDirPath: string
  destDirPath: string
  constants: Constants
}
type Result = { isSetSplashImage: boolean }

export class SetSpashImageTask extends Task<Params, Result> {
  private name: string

  constructor(name: string) {
    super()
    this.name = name
  }

  async forward({ templateDirPath, currentDirPath, destDirPath, constants }: Params) {
    let isSetSplashImage: boolean

    const imageDestDirPath = path.join(
      destDirPath,
      changeCase.pascalCase(this.name),
      'Images.xcassets',
      'SplashImage.imageset',
      constants.splashImageFileName
    )

    try {
      await existsAsync(path.join(currentDirPath, constants.splashImageFileName))
        ? await renameAsync(path.join(currentDirPath, constants.splashImageFileName), imageDestDirPath)
        : await copyFileAsync(path.join(templateDirPath, 'defaults', constants.splashImageFileName), imageDestDirPath)
      isSetSplashImage = true
    } catch (err) {
      console.error(`Error, splash image wasn\'t set. ${err}`)
      isSetSplashImage = false
    }
    return { isSetSplashImage }
  }
}