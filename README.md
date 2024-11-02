# Dialog AI

## About

Dialog AI is a Chrome extension built for [Google Chrome Built-in AI Challenge](https://googlechromeai.devpost.com). The extension allows you to leverage new AI APIs in Chrome. Once installed, you can use it on any website by holding <kbd>Shift</kbd> and selecting text or by pressing the <kbd>Shift</kbd> + <kbd>D</kbd> key combination. Doing so will open a dialog in which you can translate and summarize text and chat with Chrome built-in AI.

## How to use
The APIs used in this extension are still experimental and to use them, you need to download [Chrome Canary version](https://www.google.com/chrome/canary).

Once Chrome Canary is installed, you need to enable the experimental APIs.

1. Open Chrome Canary
2. Go to [chrome://flags/#optimization-guide-on-device-model](chrome://flags/#optimization-guide-on-device-model) and select `Enabled BypassPerfRequirement`
3. Go to [chrome://flags/#prompt-api-for-gemini-nano](chrome://flags/#prompt-api-for-gemini-nano) and select `Enabled`
4. Open console on any website and use the following code snippet:
```javascript
await ai.languageModel.create()
```
5. Go to [chrome://components](chrome://components) and  find `Optimization Guide On Device Model` then click `Download`. This will download the AI model Chrome uses. It might take some time.
6. Go to [chrome://flags/#summarization-api-for-gemini-nano](chrome://flags/#summarization-api-for-gemini-nano) and select `Enabled`
7. Open console on any website and use the following code snippet:
```javascript
await ai.summarizer.create()
```
8. Go to [chrome://flags/#translation-api](chrome://flags/#translation-api) and select `Enabled without language pack limit`
9. **(Optional)** Install language packs you want to use - [chrome://on-device-translation-internals/](chrome://on-device-translation-internals/). The extension will automatically download the required pack when you select a language pair for the first time, so this step is not necessary.


After you have all the APIs enabled and the model has finished downloading, you need to build and install the extension. To do this step, you need to have [Node.js](https://nodejs.org/en) with version `>=20` installed.

1. Clone this repository
2. Run the following commands (in order) in a terminal, while in the root directory of the repository:
```
npm install
npm run build
```
3. Open Chrome Canary and go to [chrome://extensions](chrome://extensions).
4. Enable developer mode (top right of page).
5. Click "Load unpacked extension" (top left page).
6. Select `dist` directory.