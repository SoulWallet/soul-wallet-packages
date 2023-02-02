# Soul Wallet Plugin

+ We will debug at any time, not a stable version~! 🚧

## Quick start

### Install pnpm

`npm i -g pnpm`

### Install dependencies

`pnpm i`


### Start Plugin

`pnpm dev`


## Code Structure

```
soul-wallet-extension
│
│
└───components
│
│
└───css (global css)
│
│
└───lib (global libraries)
│
│
└───pages
│
│
└───popup(extension entrance)
│
│
└───sdk(contract related actions)
```

## Resources

(figma)[https://www.figma.com/file/pLBiwLUILaudvLxVmo7Msd/Untitled?node-id=0%3A1]
(heroicons)[https://heroicons.com/]

## TODO
[ ] chrome.storage.session requires chrome version >= 102, add polyfill.