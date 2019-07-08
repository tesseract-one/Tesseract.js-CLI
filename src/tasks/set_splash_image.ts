import path from 'path'
import { pascalCase } from 'change-case'
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
      pascalCase(config.name),
      'Images.xcassets',
      'SplashImage.imageset',
      path.basename(config.template.resources.splashImage)
    )

    await copyFileAsync(spashImagePath, imageDestDirPath)

    return {}
  }
}