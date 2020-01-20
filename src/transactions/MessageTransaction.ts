import { Transactions, Utils } from "@arkecosystem/crypto";
import ByteBuffer from "bytebuffer";
import { IMessageData } from "../interfaces";

const { schemas } = Transactions;

const BUSINESS_REGISTRATION_TYPE = 100;
const BUSINESS_REGISTRATION_TYPE_GROUP = 1001;

export class MessageTransaction extends Transactions.Transaction {
    public static typeGroup: number = BUSINESS_REGISTRATION_TYPE_GROUP;
    public static type: number = BUSINESS_REGISTRATION_TYPE;
    public static key: string = "message_key";

    public static getSchema(): Transactions.schemas.TransactionSchema {
        return schemas.extend(schemas.transactionBaseSchema, {
            $id: "messageData",
            required: ["asset", "typeGroup"],
            properties: {
                type: { transactionType: BUSINESS_REGISTRATION_TYPE },
                typeGroup: { const: 1001 },
                amount: { bignumber: { minimum: 0, maximum: 0 } },
                asset: {
                    type: "object",
                    required: ["messageData"],
                    properties: {
                        messageData: {
                            type: "object",
                            required: ["content"],
                            properties: {
                                content: {
                                    minLength: 0,
                                    maxLength: 1024,
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    protected static defaultStaticFee: Utils.BigNumber = Utils.BigNumber.make("5000");

    public serialize(): ByteBuffer {
        const { data } = this;

        const messageData = data.asset.messageData as IMessageData;

        const contentBytes = Buffer.from(messageData.content, "utf8");

        const buffer = new ByteBuffer(contentBytes.length + 2, true);

        buffer.writeUint8(contentBytes.length);
        buffer.append(contentBytes, "hex");

        return buffer;
    }

    public deserialize(buf: ByteBuffer): void {
        const { data } = this;
        const messageData = {} as IMessageData;

        const contentLength = buf.readUint8();
        messageData.content = buf.readString(contentLength);

        data.asset = {
            messageData,
        };
    }
}
