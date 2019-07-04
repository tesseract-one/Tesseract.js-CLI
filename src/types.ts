export type RenderedAction = {
  file: string
  attributes: Object
  body: string
}

export type RenderedResult = any

export type RenderConfig = {
  cwd: string
  logger: any
  createPrompter: () => any
  exec: (action: any, body: any) => any
  debug: boolean
}

export type GenerationParams = {
  templatePath: string,
  name: string,
  url: string,
  isLightStatusBar: boolean,
  statusBarColor: string
}

export type RenderArguments = {
  cwd: string
  actionfolder: string
  name: string
  url: string
  barStyle: string
  red: string
  green: string
  blue: string
}

export type Constants = {
  statusBarColor: string
  appIconFileName: string
  splashImageFileName: string
}