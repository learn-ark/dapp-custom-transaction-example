import { Interfaces, Transactions, Utils } from "@arkecosystem/crypto";

export class BusinessRegistrationBuilder extends Transactions.TransactionBuilder<BusinessRegistrationBuilder> {
  constructor() {
    super();
    this.data.type = 100;
    this.data.fee = Utils.BigNumber.make("5000000000");
    this.data.amount = Utils.BigNumber.ZERO;
    this.data.asset = { businessRegistration: {} };
  }

  public businessAsset(name: string, website: string): BusinessRegistrationBuilder {
    this.data.asset.businessRegistration = {
      name,
      website,
    };

    return this;
  }

  public getStruct(): Interfaces.ITransactionData {
    const struct: Interfaces.ITransactionData = super.getStruct();
    struct.amount = this.data.amount;
    struct.asset = this.data.asset;
    return struct;
  }

  protected instance(): BusinessRegistrationBuilder {
    return this;
  }
}
