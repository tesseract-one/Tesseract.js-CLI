---
to: <%= h.changeCase.paramCase(name) %>/Podfile
---

use_frameworks!
platform :ios, "11.0"

target :<%= h.changeCase.pascalCase(name) %> do
  pod 'TesseractSDK/Ethereum', '~> 0.1'
  pod 'Crashlytics'
  pod 'Fabric'
end

