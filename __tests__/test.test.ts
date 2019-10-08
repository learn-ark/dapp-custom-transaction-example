import "jest-extended";

import { Managers, Transactions } from "@arkecosystem/crypto";
import { BusinessRegistrationBuilder } from "../src/builders";
import { BusinessRegistrationTransaction } from "../src/transactions";

describe("Test builder",()=>{

    it("Should verify correctly", ()=> {
        Managers.configManager.setFromPreset("testnet");
        Transactions.TransactionRegistry.registerTransactionType(BusinessRegistrationTransaction);

        const builder = new BusinessRegistrationBuilder();
        const actual = builder
            .businessAsset("google","www.google.com")
            .nonce("3")
            .sign("clay harbor enemy utility margin pretty hub comic piece aerobic umbrella acquire");

        expect(actual.build().verified).toBeTrue();
        expect(actual.verify()).toBeTrue();
    });
});
