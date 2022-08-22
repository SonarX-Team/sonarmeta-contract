# SonarMeta Contracts

This is the repository for SonarMeta Ethereum contracts.

## Quick Start

### Hardhat

Hardhat is a contract framework providing contract compiling, testing and deploying functions.

It provides `npx` scripts to finish above functions.

To install related dependencies, use the following command:

```shell
$ npm install
```

Moreover, this project integrates `typescript-typechain` and `hardhat-toolbox` to make the development easier.

It also includes `ethers` and `mocha` library for testing and deployment.

### Compile Contracts

```shell
npx hardhat compile
```

It will generate .abi files under the `artifacts` directory.

### Deploy Contracts

```shell
npx hardhat deploy
```

It actually runs the scripts inside the `scripts` directory.

### Test Contracts

```shell
npx hardhat test
```

It actually runs the scripts inside the `test` directory.

### Run a Local Node

```shell
npx hardhat node
```

It will run an ethereum node locally.

