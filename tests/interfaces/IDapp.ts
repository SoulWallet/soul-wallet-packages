import { Page } from "@playwright/test";

export interface IDapp {
    name: string;
    website: string;
    run(page: Page): Promise<boolean>;
}
