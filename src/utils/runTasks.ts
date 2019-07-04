import { Runner } from '.'
import yargs from 'yargs'
import * as Tasks from '../tasks'
import { GenerationParams } from '../types'

export const runTasks = async (params: yargs.Arguments<GenerationParams>) => {
  new Runner({ currentDirPath: process.cwd() })
    .add(new Tasks.GetTemplateDirPathTask(params.templatePath))
    .add(new Tasks.CheckTemplateDirTask())
    .add(new Tasks.GetTemplateConstants())
    .add(new Tasks.ProceedDestDirTask(params.name))
    .add(new Tasks.RenderTemplateTask(params))
    .add(new Tasks.ExecuteTemplateTask())
    .add(new Tasks.SetSpashImageTask(params.name))
    .add(new Tasks.SetAppIcon())
    .add(new Tasks.InstallPodsTask())
    .run()
}