import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";

describe("SonarMeta", async function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContracts() {
        // Contracts are deployed using the first signer/account by default
        const [owner, controller1, controller2, user1, user2, otherAccount] = await ethers.getSigners();

        // deploy tokens
        const Token = await ethers.getContractFactory("Token");
        const token = await Token.deploy('SonarMeta Token', 'SMT');
        await token.deployed();
        const Models = await ethers.getContractFactory("ModelCollection");
        const models = await Models.deploy('SonarMeta Model Collection', 'SMC');
        await models.deployed();
        const Scenes = await ethers.getContractFactory("SceneCollection");
        const scenes = await Scenes.deploy('SonarMeta Scene Collection', 'SSC', models.address);
        await scenes.deployed();
        // deploy governance
        const Governance = await ethers.getContractFactory("Governance");
        const governance = await Governance.deploy();
        await governance.deployed();
        // deploy main contract
        const SonarMeta = await ethers.getContractFactory("SonarMeta");
        const sonarmeta = await SonarMeta.deploy(token.address, models.address, scenes.address, governance.address);

        // transfer ownership
        await token.transferOwnership(sonarmeta.address)
        await models.transferOwnership(sonarmeta.address)
        await scenes.transferOwnership(sonarmeta.address)
        // add controller
        // await governance.setController(owner.address, true);
        await governance.setController(controller1.address, true);
        await governance.setController(controller2.address, true);

        return {
            scenes,
            models,
            token,
            governance,
            sonarmeta,
            accounts: {owner, controller1, controller2, user1, user2, otherAccount}
        };
    }

    describe("Airdrop", async function () {
        it("Should apply for airdrop successfully", async function () {
            const {sonarmeta, token, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.user1).applyForAirdrop();
            await expect(await token.balanceOf(accounts.user1.address)).to.equal('1000000000000000000000');
        });

        it("Should revert with applied already", async function () {
            const {sonarmeta, token, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.user1).applyForAirdrop()
            await expect(sonarmeta.connect(accounts.user1).applyForAirdrop()).to.be.revertedWith('haa')
        });
    });

    describe('ERC20', async function () {
        it("Controller can mint tokens for treasury", async function () {
            const {governance, sonarmeta, token, accounts} = await loadFixture(deployContracts);
            await expect(sonarmeta.connect(accounts.controller1).fundTreasury(1000000)).to.be.revertedWith('tsi0')
            const treasury = accounts.controller1;
            await governance.setTreasury(treasury.address);
            await sonarmeta.connect(accounts.controller1).fundTreasury(1000000)
            await expect(await token.balanceOf(treasury.address)).to.equal(1000000);
        });

        it("Should revert with not owner", async function () {
            const {accounts, token} = await loadFixture(deployContracts);
            await expect(token.connect(accounts.user1).airdrop(accounts.user1.address, 100)).to.be.revertedWith('Ownable: caller is not the owner')
        })

        it("Treasury transfer", async function () {
            const {governance, sonarmeta, token, accounts} = await loadFixture(deployContracts);
            const treasury = accounts.controller1;
            await governance.setTreasury(treasury.address);
            await sonarmeta.connect(accounts.controller1).fundTreasury(1000000)

            // transfer
            await token.connect(treasury).transfer(accounts.user1.address, 100);
            await expect(await token.balanceOf(accounts.user1.address)).to.equal(100);
            await token.connect(accounts.user1).transfer(treasury.address, 100);
            await expect(await token.balanceOf(treasury.address)).to.equal(1000000);
        })

        it("Approve and use allowance", async function () {
            const {sonarmeta, token, accounts} = await loadFixture(deployContracts);
            // apply for airdrop
            await sonarmeta.connect(accounts.user1).applyForAirdrop();
            await expect(await token.balanceOf(accounts.user1.address)).to.equal('1000000000000000000000');
            // approve
            await token.connect(accounts.user1).approve(sonarmeta.address, (100 * 1e18).toString())
            await expect(await token.allowance(accounts.user1.address, sonarmeta.address)).to.equal('100000000000000000000'.toString());
            // spend
            await sonarmeta.connect(accounts.controller1).transferERC20UsingSonarMetaAllowance(accounts.user1.address, accounts.user2.address, '100000000000000000000')
            await expect(await token.balanceOf(accounts.user1.address)).to.equal('900000000000000000000');
            await expect(await token.balanceOf(accounts.user2.address)).to.equal('100000000000000000000');
        })

    });

    describe('ERC721', async function () {
        it("Controller mint for user", async function () {
            const {governance, sonarmeta, models, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await expect(await models.balanceOf(accounts.user1.address)).to.equal(1);
            await expect(await models.ownerOf(0)).to.equal(accounts.user1.address);
        });
        it("Should reverted with not controller", async function () {
            const {governance, sonarmeta, models, accounts} = await loadFixture(deployContracts);
            await expect(sonarmeta.connect(accounts.user1).mintERC721(accounts.user1.address)).to.be.revertedWith('nc')
        });
        it("User approve contract and contract transfer using approval", async function () {
            const {accounts, sonarmeta, models} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address)
            await expect(models.connect(accounts.user2).approve(sonarmeta.address, 0)).to.be.revertedWith('ERC721: approve caller is not token owner nor approved for all');
            await models.connect(accounts.user1).approve(sonarmeta.address, 0)
            expect(sonarmeta.connect(accounts.user1).transferERC721UsingSonarMetaApproval(0, accounts.user2.address)).to.be.revertedWith('nc')
            await sonarmeta.connect(accounts.controller1).transferERC721UsingSonarMetaApproval(0, accounts.user2.address);
            await expect(await models.ownerOf(0)).to.equal(accounts.user2.address);
            await expect(await models.balanceOf(accounts.user2.address)).to.equal(1);
        })
        it("User approve contract to grant and contract grant using approval", async function () {
            const {accounts, sonarmeta, models} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address)
            await expect(models.connect(accounts.user2).approveGrant(sonarmeta.address, 0)).to.be.revertedWith('np');
            await models.connect(accounts.user1).approveGrant(sonarmeta.address, 0)
            expect(sonarmeta.connect(accounts.user1).grantERC721UsingSonarMetaApproval(0, accounts.user2.address)).to.be.revertedWith('nc')
            await sonarmeta.connect(accounts.controller1).grantERC721UsingSonarMetaApproval(0, accounts.user2.address);
            await expect(await models.ownerOf(0)).to.equal(accounts.user1.address);
            await expect(await models.isGranted(accounts.user2.address, 0)).to.equal(true);
        })
    });

    describe('ERC998', async function () {
        it("Controller mint for user", async function () {
            const {governance, sonarmeta, scenes, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC998(accounts.user1.address);
            await expect(await scenes.balanceOf(accounts.user1.address)).to.equal(1);
            await expect(await scenes.ownerOf(0)).to.equal(accounts.user1.address);
        });
        it("User approve contract and contract transfer using approval", async function () {
            const {accounts, sonarmeta, scenes} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC998(accounts.user1.address);
            await expect(scenes.connect(accounts.user2).approve(sonarmeta.address, 0)).to.be.revertedWith('ERC721: approve caller is not token owner nor approved for all');
            await scenes.connect(accounts.user1).approve(sonarmeta.address, 0)
            expect(sonarmeta.connect(accounts.user1).transferERC998UsingSonarMetaApproval(0, accounts.user2.address)).to.be.revertedWith('nc')
            await sonarmeta.connect(accounts.controller1).transferERC998UsingSonarMetaApproval(0, accounts.user2.address);
            await expect(await scenes.ownerOf(0)).to.equal(accounts.user2.address);
            await expect(await scenes.balanceOf(accounts.user2.address)).to.equal(1);
        })
        it("User approve contract to grant and contract grant using approval", async function () {
            const {accounts, sonarmeta, scenes} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC998(accounts.user1.address);
            await expect(scenes.connect(accounts.user2).approveGrant(sonarmeta.address, 0)).to.be.revertedWith('np');
            await scenes.connect(accounts.user1).approveGrant(sonarmeta.address, 0)
            expect(sonarmeta.connect(accounts.user1).grantERC998UsingSonarMetaApproval(0, accounts.user2.address)).to.be.revertedWith('nc')
            await sonarmeta.connect(accounts.controller1).grantERC998UsingSonarMetaApproval(0, accounts.user2.address);
            await expect(await scenes.ownerOf(0)).to.equal(accounts.user1.address);
            await expect(await scenes.isGranted(accounts.user2.address, 0)).to.equal(true);
        })
        it("Should reverted with no privilege to add tokens", async function () {
            const {governance, sonarmeta, scenes, accounts} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC998(accounts.user1.address);
            await expect(scenes.connect(accounts.user1).addChild(0, 0)).to.be.revertedWith('ERC721: invalid token ID')
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user2.address);
            await expect(scenes.connect(accounts.user1).addChild(0, 0)).to.be.revertedWith('np');
        });
        it("Add or remove child tokens", async function () {
            const {governance, sonarmeta, scenes, accounts, models} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC998(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await scenes.connect(accounts.user1).addChild(0, 0);

            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user2.address);
            await models.connect(accounts.user2).approveGrant(sonarmeta.address, 1);
            await sonarmeta.connect(accounts.controller1).grantERC721UsingSonarMetaApproval(1, accounts.user1.address);
            await scenes.connect(accounts.user1).addChild(0, 1);
            await scenes.connect(accounts.user1).removeChild(0, 1);
        });
        it("Mint with multiple childs", async function () {
            const {governance, sonarmeta, scenes, accounts, models} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC998WithBatchTokens(accounts.user1.address,  [0,1,2,3]);
            await expect(await scenes.ownerOf(0)).to.equal(accounts.user1.address);
            await expect(await scenes.balanceOf(accounts.user1.address)).to.equal(1);
        });
        it("Should create NFT failed using batch child tokenIds containing some unprivileged token", async function () {
            const {governance, sonarmeta, scenes, accounts, models} = await loadFixture(deployContracts);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await sonarmeta.connect(accounts.controller1).mintERC721(accounts.user1.address);
            await expect(sonarmeta.connect(accounts.controller1).mintERC998WithBatchTokens(accounts.user1.address, [1,2,3,4,0])).to.be.revertedWith('ERC721: invalid token ID');
            await expect(await scenes.balanceOf(accounts.user1.address)).to.equal(0);
        });
    });


});
