import {ethers} from "hardhat";
import * as fs from "fs";

async function main() {
    const network: any = process.env.HARDHAT_NETWORK;
    // Come from the hardhat.config.ts, the first account is the default account to deploy contracts.
    const [owner, controller1, controller2, user1, user2, otherAccount] = await ethers.getSigners();

    // deploy tokens
    console.log('Deploy contracts in ' + network)
    console.log('Deploy tokens...')
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy('SonarMeta Token', 'BSL');
    await token.deployed();
    console.log('Deploy model collection...')
    const Models = await ethers.getContractFactory("ModelCollection");
    const models = await Models.deploy('SonarMeta Model Collection', 'SMC');
    await models.deployed();
    console.log('Deploy scene collection...')
    const Scenes = await ethers.getContractFactory("SceneCollection");
    const scenes = await Scenes.deploy('SonarMeta Scene Collection', 'SSC', models.address);
    await scenes.deployed();
    // deploy governance
    console.log('Deploy governance...')
    const Governance = await ethers.getContractFactory("Governance");
    const governance = await Governance.deploy();
    await governance.deployed();
    // deploy main contract
    console.log('Deploy SonarMeta...')
    const SonarMeta = await ethers.getContractFactory("SonarMeta");
    const sonarmeta = await SonarMeta.deploy(token.address, models.address, scenes.address, governance.address);

    // transfer ownership
    console.log('Transfer ownership...')
    await token.transferOwnership(sonarmeta.address)
    await models.transferOwnership(sonarmeta.address)
    await scenes.transferOwnership(sonarmeta.address)
    // add controller
    console.log('Add controllers...')
    await governance.setController(owner.address, true);
    await governance.setController(controller1.address, true);
    await governance.setController(controller2.address, true);

    // save the addresses
    const addresses = {
        main: sonarmeta.address,
        governance: governance.address,
        ERC20: token.address,
        ERC721: models.address,
        ERC998: scenes.address
    }
    console.log(addresses)
    fs.writeFile(`address-${network}.json`, JSON.stringify(addresses, undefined, 4), err => {
        if (err) console.log('Write file error: ' + err.message)
        else console.log(`Addresses is saved into address-${network}.json...`)
    })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
