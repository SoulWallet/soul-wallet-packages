# Soul Wallet

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

## API
- send email
- save latest guardian list

## Contract
- Activate wallet
- guardians(list, add, remove)

## Design 
- Sign transaction modal
- Send

## Product
- assets erc20 whitelist

## Frontend
- activity history, click redirect to scan
- save name locally
- cache guardians list

## TODO
1. add hash to contentScript and background
2. activity
3. remove guardian, call contract
4. sign transaction modal