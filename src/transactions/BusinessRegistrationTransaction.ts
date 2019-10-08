import { Transactions, Utils } from "@arkecosystem/crypto";
import ByteBuffer from "bytebuffer";
import { IBusinessRegistrationAsset } from "../interfaces";

const { schemas } = Transactions;

const BUSINESS_REGISTRATION_TYPE = 100;

export class BusinessRegistrationTransaction extends Transactions.Transaction {
  public static typeGroup: number = 1;
  public static type: number = BUSINESS_REGISTRATION_TYPE;
  public static key: string = "businessRegistration2";

  public static getSchema(): Transactions.schemas.TransactionSchema {
    return schemas.extend(schemas.transactionBaseSchema, {
      $id: "businessRegistration2",
      required: ["asset", "typeGroup"],
      properties: {
        type: { transactionType: BUSINESS_REGISTRATION_TYPE },
        typeGroup: { const: 1 },
        amount: { bignumber: { minimum: 0, maximum: 0 } },
        asset: {
          type: "object",
          required: ["businessRegistration"],
          properties: {
            businessRegistration: {
              type: "object",
              required: ["name", "website"],
              properties: {
                name: {
                  type: "string",
                  minLength: 3,
                  maxLength: 20
                },
                website: {
                  type: "string",
                  minLength: 3,
                  maxLength: 20
                },
              }
            }
          },
        },
      },
    });
  }

  protected static defaultStaticFee: Utils.BigNumber = Utils.BigNumber.make("5000000000");

  public serialize(): ByteBuffer {
    const { data } = this;

    const businessRegistration = data.asset.businessRegistration as IBusinessRegistrationAsset;

    const nameBytes = Buffer.from(businessRegistration.name, "utf8");
    const websiteBytes = Buffer.from(businessRegistration.website, "utf8");

    const buffer = new ByteBuffer(nameBytes.length + websiteBytes.length + 2, true);

    buffer.writeUint8(nameBytes.length);
    buffer.append(nameBytes, "hex");

    buffer.writeUint8(websiteBytes.length);
    buffer.append(websiteBytes, "hex");

    return buffer;
  }

  public deserialize(buf: ByteBuffer): void {
    const { data } = this;
    const businessRegistration = {} as IBusinessRegistrationAsset;
    const nameLength = buf.readUint8();
    businessRegistration.name = buf.readString(nameLength);

    const websiteLength = buf.readUint8();
    businessRegistration.website = buf.readString(websiteLength);

    data.asset = {
      businessRegistration
    };
  }
}
