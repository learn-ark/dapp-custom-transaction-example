import { Database, EventEmitter, State, TransactionPool } from "@arkecosystem/core-interfaces";
import { Handlers } from "@arkecosystem/core-transactions";
import { Interfaces, Transactions } from "@arkecosystem/crypto";
import { BusinessRegistrationAssetError, WalletIsAlreadyABusiness } from "../errors";
import { BusinessRegistrationTransaction } from "../transactions";

export class BusinessRegistrationTransactionHandler extends Handlers.TransactionHandler {
  public getConstructor(): Transactions.TransactionConstructor {
    return BusinessRegistrationTransaction;
  }

  public async bootstrap(connection: Database.IConnection, walletManager: State.IWalletManager): Promise<void> {
    const transactions = await connection.transactionsRepository.getAssetsByType(this.getConstructor().type);
    for (const transaction of transactions) {
      const wallet = walletManager.findByPublicKey(transaction.senderPublicKey);
      wallet.setAttribute("business", transaction.asset.businessRegistration);
      walletManager.reindex(wallet);
    }
  }

  public throwIfCannotBeApplied(
    transaction: Interfaces.ITransaction,
    wallet: State.IWallet,
    databaseWalletManager: State.IWalletManager,
  ): void {
    const { data }: Interfaces.ITransaction = transaction;

    const { name, website }: { name: string; website: string } = data.asset.businessRegistration;
    if (!name || !website) {
      throw new BusinessRegistrationAssetError();
    }

    if (wallet.hasAttribute("business")) {
      throw new WalletIsAlreadyABusiness();
    }

    super.throwIfCannotBeApplied(transaction, wallet, databaseWalletManager);
  }

  public emitEvents(transaction: Interfaces.ITransaction, emitter: EventEmitter.EventEmitter): void {
    emitter.emit("business.registered", transaction.data);
  }

  public canEnterTransactionPool(
    data: Interfaces.ITransactionData,
    pool: TransactionPool.IConnection,
    processor: TransactionPool.IProcessor,
  ): boolean {
    if (this.typeFromSenderAlreadyInPool(data, pool, processor)) {
      return false;
    }

    const { name }: { name: string } = data.asset.businessRegistration;
    const businessRegistrationsSameNameInPayload = processor
      .getTransactions()
      .filter(tx => tx.type === this.getConstructor().type && tx.asset.businessRegistration.name === name);

    if (businessRegistrationsSameNameInPayload.length > 1) {
      processor.pushError(
        data,
        "ERR_CONFLICT",
        `Multiple business registrations for "${name}" in transaction payload`,
      );
      return false;
    }

    const businessRegistrationsInPool: Interfaces.ITransactionData[] = Array.from(
      pool.getTransactionsByType(this.getConstructor().type),
    ).map((memTx: Interfaces.ITransaction) => memTx.data);
    const containsBusinessRegistrationForSameNameInPool: boolean = businessRegistrationsInPool.some(
      transaction => transaction.asset.businessRegistration.name === name,
    );
    if (containsBusinessRegistrationForSameNameInPool) {
      processor.pushError(data, "ERR_PENDING", `Business registration for "${name}" already in the pool`);
      return false;
    }

    return true;
  }

  public applyToSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
    super.applyToSender(transaction, walletManager);
    const sender: State.IWallet = walletManager.findByPublicKey(transaction.data.senderPublicKey);
    sender.setAttribute("business", transaction.data.asset.businessRegistration);
    walletManager.reindex(sender);
  }

  public revertForSender(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
    super.revertForSender(transaction, walletManager);
    const sender: State.IWallet = walletManager.findByPublicKey(transaction.data.senderPublicKey);
    sender.forgetAttribute("business");
    walletManager.reindex(sender);
  }

  public applyToRecipient(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
    return;
  }

  public revertForRecipient(transaction: Interfaces.ITransaction, walletManager: State.IWalletManager): void {
    return;
  }
}
