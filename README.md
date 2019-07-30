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
Adding:

```json
"custom-transactions": {},
```
