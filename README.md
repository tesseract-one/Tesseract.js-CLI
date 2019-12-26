## Getting Started

#### Prerequisites:

Install [imagemagick](https://imagemagick.org):

```sh
brew install imagemagick
```

#### Install:

```sh
npm install -g @tesseractjs/cli
# OR
yarn global add @tesseractjs/cli
```

#### Provide config:

You can add wrapper.config.json (or any other JSON file, but then don't forget to specify its path by command line parameter --config) like this:

```json
{
  "name": "TheAppName",
  "template": {
    "resources": {
      "appIcon": "./icon.png",
      "splashImage": "./splash-image.png"
    },
    "appId": {
      "ios": "test.app"
    }
  },
  "appConfig": {
    "dappUrls": {
      "default": [{
        "url": "https://demo.tesseract.one/",
        "name": "main"
      }],
      "testing": []
    },
    "rpcUrls": {
      "1": "https://mainnet.infura.io/v3/f20390fe230e46608572ac4378b70668"
    },
    "extra": {}
  }
}
```

and execute cli command

```sh
tesseract create wrapper -c "./config-name.json"
```

or use command line parameters

```sh
tesseract create wrapper TheAppName \
  --url "https://tesseract.one/" \
  --rpc "https://mainnet.infura.io/v3/f20390fe230e46608572ac4378b70668" \
  --app-id "test.app"
```

also, don't forget to provide icon and splash-image for the app

## Configuration of wrapper

The final configuration will be a combination of config files and command line parameters

### Command line parameters

| parameter | shortcut | Description |
|---|---|---|
--name | -n | Name of the app
--url | -u | URL of the website for the app, if there is more than one URL use config file
--rpc | -r | URL of Ethereum RPC, if there is more than one URL use config file
--template | -t | Path to template for the wrapper, also can be a link on github repo
--out | -o | Path to the output directory
--pods | -p | Run pod install after generation or not
--config | -c | Path to the configuration file
--app-id | -i | Bundle and package id of aplication
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
    },
    "fabric": {
      "key": "string",
      "secret": "string"
    },
    "appId": {
      "ios": "string"
    }
  },
  "appConfig": {
    "dappUrls": {
      "default": [{
        "url": "string",
        "name": "string"
      }],
      "testing": []
    },
    "rpcUrls": {
      "string": "string"
    },
    "extra": {}
  }
}
```

#### Template property

template needed only for a generation and won't be used by the app; path also can be an URL on github repo

#### AppConfig property

appConfig will be used by the app implicitly, notice that templates can require different properties (statusBarColor, isLightStatusBar, etc.), also you can add extra properties to the app
