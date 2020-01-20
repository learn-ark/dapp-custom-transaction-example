// tslint:disable:max-classes-per-file
import { Errors } from "@arkecosystem/core-transactions";

export class EmptyMessageAssetError extends Errors.TransactionError {
    constructor() {
        super(`Value can not be empty.`);
    }
}

export class MessageTooLongError extends Errors.TransactionError {
    constructor() {
        super(`Messagen length exceeds maximum of 1024.`);
    }
}
