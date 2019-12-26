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
  exec?: (action: any, body: any) => any
  helpers?: Object
  debug: boolean
}

export type RenderArguments = {
  actionfolder: string
  config: Config
}

export type CmdConfig = {
  name?: string
  url?: string
  network?: string
  rpc?: string
  template?: string
  out?: string
  pods?: boolean
  config?: string
  appId?: string
}

export type AppUrl = {
  name: string
  url: string
}

export type DappUrls = {
  default: AppUrl[]
  testing: AppUrl[]
}

export type AppConfig = {
  dappUrls: DappUrls
  rpcUrls: { [key: string]: string }
  extra: { [key: string]: any }
  [key: string]: any
}

export type Config = {
  name: string
  runPodInstall: boolean
  outputDir: string
  template: {
    path: string
    resources: {
      appIcon: string
      splashImage: string
      [key: string]: string
    }
    [key: string]: any
  }
  appConfig: AppConfig
}