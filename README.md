# ARK Core - Custom-transaction

This is a basic example of ark custom transaction.

```bash
cd plugins/
git submodule add -f https://github.com/KovacZan/custom-transaction
cd custom-transaction
```

Adding it to plugins.js (mainnet,devnet,testnet)

```bash
cd packages/core/bin/config/testnet
```
Add:

```json
"@arkecosystem/custom-transactions": {},
```

Curl example:

```bash
curl -X POST \
    http://127.0.0.1:4003/api/transactions \
    -H 'Content-Type: application/json' \
    -d '{
    "transactions": [
        {
            "version": 2,
            "network": 23,
            "typeGroup": 1001,
            "type": 100,
            "nonce": "3",
            "senderPublicKey": "03287bfebba4c7881a0509717e71b34b63f31e40021c321f89ae04f84be6d6ac37",
            "fee": "5000000000",
            "amount": "0",
            "asset": {
                "businessRegistration": {
                    "name": "google",
                    "website": "www.google.com"
                }
            },
            "signature": "809dac6e3077d6ae2083b353b6020badc37195c286079d466bb1d6670ed4e9628a5b5d0a621801e2763aae5add41905036ed8d21609ed9ddde9f941bd066833c",
            "id": "b567325019edeef0ce5a1134af0b642a54ed2a8266a406e1a999f5d590eb5c3c"
        }
  ]
}'
```
