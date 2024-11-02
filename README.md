# Dialog AI

## About
![preview](https://github.com/user-attachments/assets/3de2c831-25d3-4906-b530-259e2c10b9d1)

Dialog AI is a Chrome extension built for [Google Chrome Built-in AI Challenge](https://googlechromeai.devpost.com). The extension allows you to leverage new AI APIs in Chrome. Once installed, you can use it on any website by holding <kbd>Shift</kbd> and selecting text or by pressing the <kbd>Shift</kbd> + <kbd>D</kbd> key combination or by clicking the extension icon while you have a website open. Doing so will open a dialog in which you can translate and summarize text and chat with Chrome built-in AI.

## How to use
The APIs used in this extension are still experimental and to use them, you need to download and install [Chrome Canary version](https://www.google.com/chrome/canary).

Once `Chrome Canary` is installed, you need to enable the experimental APIs.

1. Open `Chrome Canary`
2. Go to (by entering the following in Chrome address bar) `chrome://flags/#optimization-guide-on-device-model` and select `Enabled BypassPerfRequirement`
3. Go to `chrome://flags/#prompt-api-for-gemini-nano` and select `Enabled`
4. Open developer console by pressing <kbd>Option</kbd> + <kbd>⌘</kbd> + <kbd>J</kbd> (on macOS), or <kbd>Shift</kbd> + <kbd>CTRL</kbd> + <kbd>J</kbd> (on Windows/Linux) and paste the following code snippet:
```javascript
await ai.languageModel.create()
```
5. Go to `chrome://components` and  find `Optimization Guide On Device Model` then click `Download`. This will download the AI model Chrome uses. It might take some time.
6. Go to `chrome://flags/#summarization-api-for-gemini-nano` and select `Enabled`
7. Open developer console and paste the following code snippet:
```javascript
await ai.summarizer.create()
```
8. Go to `chrome://flags/#translation-api` and select `Enabled without language pack limit`
9. **(Optional)** Install language packs you want to use - `chrome://on-device-translation-internals`. The extension will automatically download the required pack when you select a language pair for the first time, so this step is not necessary.


After you have all the APIs enabled and the model has finished downloading, you need to install the extension. 
1. Go to [releases](https://github.com/kowalczyk-krzysztof/dialog-ai/releases) and find the latest release.
2. Download `dist.zip` attached to the release and unzip it.
3. Open `Chrome Canary` and go to `chrome://extensions`.
4. Enable developer mode (top right of page).
5. Click `Load unpacked extension` (top left page).
6. Select the directory you unzipped earlier (by default, the name of the directory will be `dist`)


Alternatively, if you want to build the extension yourself, you can do that using the steps below (you need to have [Node.js](https://nodejs.org/en) with version `>=20` installed):
1. Clone this repository
2. Run the following commands (in order) in a terminal, while in the root directory of the repository:
```
npm install
npm run build
```
3. Open `Chrome Canary` and go to `chrome://extensions`.
4. Enable developer mode (top right of page).
5. Click `Load unpacked extension` (top left page).
6. Select `dist` directory located in the root of the repository
