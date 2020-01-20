import { Interfaces, Transactions, Utils } from "@arkecosystem/crypto";
import { MessageTransaction } from "../transactions";

export class MessageTransactionBuilder extends Transactions.TransactionBuilder<MessageTransactionBuilder> {
    constructor() {
        super();
        this.data.type = MessageTransaction.type;
        this.data.typeGroup = MessageTransaction.typeGroup;
        this.data.version = 2;
        this.data.fee = Utils.BigNumber.make("5000");
        this.data.amount = Utils.BigNumber.ZERO;
        this.data.asset = { businessData: {} };
    }

    public messageData(content: string): MessageTransactionBuilder {
        this.data.asset.businessData = {
            content,
        };

        return this;
    }

    public getStruct(): Interfaces.ITransactionData {
        const struct: Interfaces.ITransactionData = super.getStruct();
        struct.amount = this.data.amount;
        struct.asset = this.data.asset;
        return struct;
    }

    protected instance(): MessageTransactionBuilder {
        return this;
    }
}
