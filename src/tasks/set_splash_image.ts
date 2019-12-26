import path from 'path'
import { pascalCase } from 'change-case'
import  { Task, copyFileAsync, existsAsync, unlinkAsync } from '../utils'
import { Config } from '../types'

type Params = {
  config: Config
  templateDirPath: string
  currentDirPath: string
  destDirPath: string
}
type Result = {}

export class SetSpashImageTask extends Task<Params, Result> {
  public description = 'Copying splash image...'

  async forward({ config, destDirPath }: Params) {
    const spashImagePath = config.template.resources.splashImage
    await copyFileAsync(spashImagePath, this.getImageDestDirPath(config, destDirPath))
    return {}
  }

  async rollback({ config, destDirPath }: Params) {
    const imageDestDirPath = this.getImageDestDirPath(config, destDirPath)
    if (await existsAsync(imageDestDirPath)) await unlinkAsync(imageDestDirPath)
  }

  private getImageDestDirPath(config: Config, destDirPath: string): string {
    return path.join(
      destDirPath,
      pascalCase(config.name),
      'Images.xcassets',
      'SplashImage.imageset',
      path.basename(config.template.resources.splashImage)
    )
  }
}