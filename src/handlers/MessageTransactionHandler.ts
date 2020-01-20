import { Database, EventEmitter, State, TransactionPool } from "@arkecosystem/core-interfaces";
import { Handlers } from "@arkecosystem/core-transactions";
import { Interfaces, Transactions } from "@arkecosystem/crypto";
import { EmptyMessageAssetError, MessageTooLongError } from "../errors";
import { MessageTransaction } from "../transactions";

export class MessageTransactionHandler extends Handlers.TransactionHandler {
    public getConstructor(): Transactions.TransactionConstructor {
        return MessageTransaction;
    }

    public dependencies(): ReadonlyArray<Handlers.TransactionHandlerConstructor> {
        return [];
    }

    public walletAttributes(): ReadonlyArray<string> {
        return ["transactionWalletKeyName"];
    }

    public async isActivated(): Promise<boolean> {
        return true;
    }

    public async bootstrap(connection: Database.IConnection, walletManager: State.IWalletManager): Promise<void> {
        // const reader: TransactionReader = await TransactionReader.create(connection, this.getConstructor());

        // while (reader.hasNext()) {
        //     const transactions = await reader.read();

        //     for (const transaction of transactions) {
        //         const wallet: State.IWallet = walletManager.findByPublicKey(transaction.senderPublicKey);
        //         const asset: IBusinessData = {
        //             name: transaction.asset.businessData.name,
        //             website: transaction.asset.businessData.website,
        //         };

        //         wallet.setAttribute<IBusinessData>("transactionWalletKeyName", asset);
        //         walletManager.reindex(wallet);
        //     }
        // }
        return;
    }

    public async throwIfCannotBeApplied(
        transaction: Interfaces.ITransaction,
        wallet: State.IWallet,
        databaseWalletManager: State.IWalletManager,
    ): Promise<void> {
        const { data }: Interfaces.ITransaction = transaction;

        const { content }: { content: string } = data.asset.messageData;
        if (!content) {
            throw new EmptyMessageAssetError();
        }

        if (content.length > 1024) {
            throw new MessageTooLongError();
        }

        await super.throwIfCannotBeApplied(transaction, wallet, databaseWalletManager);
    }

    public emitEvents(transaction: Interfaces.ITransaction, emitter: EventEmitter.EventEmitter): void {
        emitter.emit("message.sent", transaction.data);
    }

    public async canEnterTransactionPool(
        data: Interfaces.ITransactionData,
        pool: TransactionPool.IConnection,
        processor: TransactionPool.IProcessor,
    ): Promise<{ type: string; message: string } | null> {
        const err = await this.typeFromSenderAlreadyInPool(data, pool);
        if (err !== null) {
            return err;
        }

        return null;
    }

    public async applyToSender(
        transaction: Interfaces.ITransaction,
        walletManager: State.IWalletManager,
    ): Promise<void> {
        return;
    }

    public async revertForSender(
        transaction: Interfaces.ITransaction,
        walletManager: State.IWalletManager,
    ): Promise<void> {
        return;
    }

    public async applyToRecipient(
        transaction: Interfaces.ITransaction,
        walletManager: State.IWalletManager,
    ): Promise<void> {
        return;
    }

    public async revertForRecipient(
        transaction: Interfaces.ITransaction,
        walletManager: State.IWalletManager,
    ): Promise<void> {
        return;
    }
}
