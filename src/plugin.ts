import { Container, Logger } from "@arkecosystem/core-interfaces";
import { Handlers } from "@arkecosystem/core-transactions";
import { defaults } from "./defaults";
import { BusinessRegistrationTransactionHandler } from "./handler";

export const plugin: Container.IPluginDescriptor = {
  pkg: require("../package.json"),
  defaults,
  alias: "my-custom-transaction",
  async register(container: Container.IContainer, options) {
    container.resolvePlugin<Logger.ILogger>("logger").info("Registering custom transaction");
    Handlers.Registry.registerCustomTransactionHandler(BusinessRegistrationTransactionHandler);
  },
  async deregister(container: Container.IContainer, options) {
    container.resolvePlugin<Logger.ILogger>("logger").info("Deregistering custom transaction");
    Handlers.Registry.deregisterCustomTransactionHandler(BusinessRegistrationTransactionHandler);
  }
};
