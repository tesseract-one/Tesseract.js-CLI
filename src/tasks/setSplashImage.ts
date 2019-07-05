import path from 'path'
import changeCase from 'change-case'
import  { Task, copyFileAsync } from '../utils'
import { Config } from '../types'

type Params = {
  config: Config
  templateDirPath: string
  currentDirPath: string
  destDirPath: string
}
type Result = {}

export class SetSpashImageTask extends Task<Params, Result> {
  async forward({ config, destDirPath }: Params) {
    const spashImagePath = config.template.resources.splashImage

    const imageDestDirPath = path.join(
      destDirPath,
      changeCase.pascalCase(config.name),
      'Images.xcassets',
      'SplashImage.imageset',
      config.template.resources.splashImage
    )

    try { // ??? copy or not
      await copyFileAsync(spashImagePath, imageDestDirPath)
    } catch (err) {
      console.error(`Error, splash image wasn\'t set. ${err}`)
    }
    return {}
  }
}