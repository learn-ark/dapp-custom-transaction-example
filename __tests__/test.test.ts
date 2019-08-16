import "jest-extended";
import { Handlers } from "@arkecosystem/core-transactions";
import { Managers } from "@arkecosystem/crypto";
import { BusinessRegistrationBuilder } from "../src/builders";
import { BusinessRegistrationTransactionHandler } from "../src/handlers";

describe("Test builder",()=>{
    Managers.configManager.setFromPreset("testnet");
    Handlers.Registry.registerTransactionHandler(BusinessRegistrationTransactionHandler);

    it("Should verify correctly", ()=> {
        const builder = new BusinessRegistrationBuilder();
        const actual = builder
            .nonce("3")
            .fee("100")
            .businessAsset("google","www.google.com")
            .sign("clay harbor enemy utility margin pretty hub comic piece aerobic umbrella acquire");
        console.log(actual.build().toJson());
        expect(actual.build().verified).toBeTrue();
        expect(actual.verify()).toBeTrue();
    });
});
