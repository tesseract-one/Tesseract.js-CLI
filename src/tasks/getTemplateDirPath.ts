import path from 'path'
import os from 'os'
import crypto from 'crypto'
import { spawn } from 'child_process'
import { Task, waitTillExit, removeDirAsync } from '../utils'
import { Config } from '../types'

type Params = {
  config: Config,
  currentDirPath: string
}
type Result = { templateDirPath: string }

export class GetTemplateDirPathTask extends Task<Params, Result> {
  async forward({ config, currentDirPath }: Params) {
    let templateUrl: URL | null = null
    let templateDirPath: string
    let isTemplateFromGit = false

    try { templateUrl = new URL(config.template.path) }
    catch {}

    if (templateUrl !== null) {
      templateDirPath = path.join(os.tmpdir(), crypto.randomBytes(16).toString('hex'))
      await waitTillExit(spawn('git', ['clone', templateUrl.href, templateDirPath], { stdio: 'inherit' }))
      isTemplateFromGit = true
      await removeDirAsync(path.join(templateDirPath, '.git'))
    } else {
      templateDirPath = path.isAbsolute(config.template.path) 
        ? config.template.path
        : path.join(currentDirPath, config.template.path)
    }

    return { templateDirPath, isTemplateFromGit }
  }
}


