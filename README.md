# Soul Wallet Packages
+ We will debug at any time, not a stable version~! 🚧

monorepo management with pnpm workspace

## Quick start



### Install dependencies for all repos

`pnpm i`


### Start Plugin

`pnpm dev:wallet`


## Useful commands

### Install dependency for specific repo

`pnpm i ${dependencyName} --filter ${packageName}`

### Install dependency for root (common)

`pnpm i ${dependencyName} -W`

## Dev Guide

### Import sibling package

Link package as dependency first, which is already done in the repo:

`pnpm add ${dependencyPackage} --filter ${packageName}`

Import package like what you did before, take `soul-wallet-lib` for example:

`import { WalletLib } from "soul-wallet-lib";`

## Notice

### Install pnpm if you did't have it installed yet
`npm i -g pnpm`

## TODO
[ ] chrome.storage.session requires chrome version >= 102, add polyfill.
