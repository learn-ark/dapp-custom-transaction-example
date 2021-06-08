import { Container, Contracts, Providers } from "@arkecosystem/core-kernel";
import { BusinessRegistrationTransactionHandler } from "./handlers/BusinessRegistrationTransactionHandler";

const plugin = require("../package.json");

export class ServiceProvider extends Providers.ServiceProvider {
    public async register(): Promise<void> {
        const logger: Contracts.Kernel.Logger = this.app.get(Container.Identifiers.LogService);
        logger.info(`Loading plugin: ${plugin.name} with version ${plugin.version}.`);

        this.app.bind(Container.Identifiers.TransactionHandler).to(BusinessRegistrationTransactionHandler);
    }
}