# Yeelight Chrome extension
<img src="https://zisest.ru/files/yeelight-chrome-logo.png" align="right"
     title="Where Do I Sit? logo" width="266" height="81">
     
This Chrome extension seems to be the simplest way to control your Xiaomi Yeelight smart bulbs from a PC.
## About
[![](https://zisest.ru/files/yeelight-chrome.png)](https://github.com/zisest/yeelight-chrome)

The extension allows you to connect to your Yeelight devices via Wi-Fi and control them using an intuitive user interface.

## Features
- Switching light on and off
- Controlling hue and saturation of the light
- Setting color temperature
- Adjusting brightness
- *Renaming devices [TO DO]*

## Installation

1. Clone the repository
2. Go to `chrome://extensions` in Chrome
3. Turn on 'Developer mode' (top right corner)
4. Click 'Load unpacked'
5. Select `yeelight-chrome-app` directory
6. Copy the app id and paste the value into `companionAppID` variable in `yeelight-chrome-extension/src/App.js`
7. `cd` into `yeelight-chrome-extension` directory
8. `npm run build`
9. Load `yeelight-chrome-extension/build` folder into Chrome
10. Copy the extension id and paste it into `extensionID` variable in `yeelight-chrome-app/index.js`
11. Reload the companion app
12. You can now connect to your device by clicking the extension icon and following the provided directions

## Additional information
- The extension requires a companion Chrome app in order to scan your local network and establish connections via TCP sockets. The companion app is the [Yeelight developer demo](https://www.yeelight.com/en_US/developer "Y") with some minor changes.

- Since the extension is not installed from the Chrome Web Store, on every Chrome launch you'll get a prompt saying the developer mode is enabled. [This suggestion](https://stackoverflow.com/questions/23055651/disable-developer-mode-extensions-pop-up-in-chrome "This") might help get rid of it but I do plan to add the extension to the Chrome store sometime soon.

## Troubleshooting
For feedback/troubleshooting please contact me at [zisest@gmail.com](mailto:zisest@gmail.com?subject=Yeelight%20Chrome "zisest@gmail.com").
