// @ts-nocheck

// inject global variable to user page
window.soul = {
    isSoul: true,
    sign: () => {
        window.postMessage({
            target: "soul",
            type: "sign",
            data: {},
        });
    },
};


// const web3 = new Web3('infura')



// const web3 = new Web3(provider);

// contract.methods.addLiquidity().send();
