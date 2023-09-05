import { BrowserContext, ElementHandle, Locator, Page } from "@playwright/test";
import { IDapp } from "../interfaces/IDapp";
export class uniswap implements IDapp {
    name = "Uniswap";
    website = "https://app.uniswap.org/";
    async run(page: Page): Promise<boolean> {
        await page.goto("https://app.uniswap.org/");
        // wait id="swap-page" appear
        await page.waitForSelector("#swap-page");

        // test-id="web3-status-connected"
        let disconnect: Locator | null = null;
        try {
            // data-testid="web3-status-connected"
            disconnect = page.getByTestId("web3-status-connected");
        } catch (error) {
            console.log("error", error);
        }
        if (disconnect !== null) {
            await page.getByTestId("web3-status-connected").click();
            await page.getByTestId("wallet-disconnect").click();
            await page.getByTestId("wallet-disconnect").click();
        } else {
            await page.getByTestId("navbar-connect-wallet").click();
        }

        await page.getByTestId("wallet-option-INJECTED").click();
        await page.waitForTimeout(1000); // wait for connect
        // swap eth -> uni
        await page.locator("#swap-currency-input").getByPlaceholder("0").click();
        await page.locator("#swap-currency-input").getByPlaceholder("0").fill("0.00001");
        await page.getByRole("button", { name: "Select token" }).click();
        await page.getByText("UniswapUNI0").click();
        await page.locator("#swap-currency-output").getByPlaceholder("0").click();
        await page.getByTestId("swap-button").click();
        await page.getByTestId("confirm-swap-button").click();

        await page.waitForTimeout(3000); // wait for transaction

        return true;
    }
}
