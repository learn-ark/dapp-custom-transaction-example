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
    http://127.0.0.1:4003/api/v2/transactions \
    -H 'Content-Type: application/json' \
    -d '{
    "transactions": [
    {     
        "id": "db8a9c8e7914bbef72515eaeb24a8d8052891c0dcdda3ee46d1045d714327c80",
        "signature": "9f2ca69de1b282dbd40edad8cd4c6c4be609c224f885fd5446358bb9d0602452a1ab9866c9755985f2be90c065bcfa767cc63bd10152040e227f4298dab17dba",
        "version": 2,
        "type": 100,
        "fee": 100,
        "senderPublicKey":
        "03287bfebba4c7881a0509717e71b34b63f31e40021c321f89ae04f84be6d6ac37",
        "nonce": 3,
        "amount": 0,
        "asset":
            { 
                "businessRegistration": { 
                                             "name": "google",
                                             "website": "www.google.com"
                                        } 
            } 
    }
  ]
}'
```
