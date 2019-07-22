## Getting Started

#### Install:

```sh
npm install -g tesseract
# OR
yarn global add tesseract
```

#### Provide config:

You can add wrapper.config.json (or any other JSON file, but then don't forget to specify its path by command line subcommand --config) like this:

```json
{
  "outputDir": "./",
  "template": {
    "path": "https://github.com/tesseract-one/WrapperTemplate-iOS.git",
    "resources": {
      "appIcon": "./icon.png",
      "splashImage": "./splash-image.png"
    }
  },
  "appConfig": {
    "dappUrls": {
      "default": [{
        "netId": "1",
        "url": "https://beta.cent.co/",
        "name": "main"
      }],
      "testing": []
    },
    "rpcUrls": {
      "1": "https://mainnet.infura.io/v3/f20390fe230e46608572ac4378b70668"
    },
    "extra": {},
    "statusBarColor": "#222222",
    "isLightStatusBar": true
  }
}
```

or use command line subcommands

```sh
--out "./"
--template "https://github.com/tesseract-one/WrapperTemplate-iOS.git"
--url "https://beta.cent.co/"
--rpc "https://mainnet.infura.io/v3/f20390fe230e46608572ac4378b70668"
--pods true
```

also, don't forget to provide icon and splash-image for the app

#### Create a wrapper:

```sh
tesseract create wrapper TheAppName [subcommands]
```

## Configuration of wrapper

The final configuration will be a combination of config files and command line subcommands

### Command line subcommands

| subcommand | shortcut | Description |
|---|---|---|
--name | -n | Name of the app
--url | -u | URL of the website for the app, if there is more than one URL use config file
--rpc | -r | URL of Ethereum RPC, if there is more than one URL use config file
--template | -t | Path to template for the wrapper, also can be a link on github repo
--out | -o | Path to the output directory
--pods | -p | Run pod install after generation or not
--config | -c | Path to the configuration file
--help | -h | Auto-generated usage information
--version | -v | Version of the CLI

### Configuration file

```json
{
  "name": "string",
  "outputDir": "string",
  "runPodInstall": "boolean",
  "template": {
    "path": "string",
    "resources": {
      "appIcon": "string",
      "splashImage": "string"
    }
  },
  "appConfig": {
    "dappUrls": {
      "default": [{
        "netId": "string",
        "url": "string",
        "name": "string"
      }],
      "testing": []
    },
    "rpcUrls": {
      "string": "string"
    },
    "extra": {},
    "statusBarColor": "string",
    "isLightStatusBar": "boolean"
  }
}
```

#### Template property

template needed only for a generation and won't be used by the app; path also can be an URL on github repo

#### AppConfig property

appConfig will be used by the app implicitly, notice that templates can require different properties (statusBarColor, isLightStatusBar, etc.), also you can add extra properties to the app
