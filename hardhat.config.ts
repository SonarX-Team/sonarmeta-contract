import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";

const config: HardhatUserConfig = {
    solidity: "0.8.9",
    networks: {
        hardhat: {},
        ganache: {
            url: 'http://localhost:7545',
            accounts: [
                '0x66802bc37d3cfb38ff282b24d420280b5616554388432bd48457b65b0208abfb',
                '0x8f01ac58c592328b827eeb73a0f024475133088038845a29ac16c31a6c761927',
                '0xa78dd2aa256882a25fe5b929575f6f70c6e8b1872b22c1925274dee71596d940',
                '0x66e3792dc624ecafb28cc744762d63c6016ed29bc5c5bdf409ade7fc112a52ec',
                '0x172a483415c5e119f1ea336d44646572ac34a088e7bc2884f8e1f83da4cb304a'
            ]
        },
        bsctest: {
            url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
            accounts: [
                '0x66802bc37d3cfb38ff282b24d420280b5616554388432bd48457b65b0208abfb',
                '0x8f01ac58c592328b827eeb73a0f024475133088038845a29ac16c31a6c761927',
                '0xa78dd2aa256882a25fe5b929575f6f70c6e8b1872b22c1925274dee71596d940',
                '0x66e3792dc624ecafb28cc744762d63c6016ed29bc5c5bdf409ade7fc112a52ec',
                '0x172a483415c5e119f1ea336d44646572ac34a088e7bc2884f8e1f83da4cb304a'
            ]
        },
        chainbaserinkeby: {
            url: 'https://ethereum-rinkeby.s.chainbase.online/v1/2Dhf8fn69zor7wXkQU0NxVm8jGq',
            accounts: [
                '0x66802bc37d3cfb38ff282b24d420280b5616554388432bd48457b65b0208abfb',
                '0x8f01ac58c592328b827eeb73a0f024475133088038845a29ac16c31a6c761927',
                '0xa78dd2aa256882a25fe5b929575f6f70c6e8b1872b22c1925274dee71596d940',
                '0x66e3792dc624ecafb28cc744762d63c6016ed29bc5c5bdf409ade7fc112a52ec',
                '0x172a483415c5e119f1ea336d44646572ac34a088e7bc2884f8e1f83da4cb304a'
            ]
        },
        chainbasebsctest: {
            url: 'https://bsc-testnet.s.chainbase.online/v1/2DlNmx0PiuN6Ww9iyS1qxY67AmO',
            accounts: [
                '0x66802bc37d3cfb38ff282b24d420280b5616554388432bd48457b65b0208abfb',
                '0x8f01ac58c592328b827eeb73a0f024475133088038845a29ac16c31a6c761927',
                '0xa78dd2aa256882a25fe5b929575f6f70c6e8b1872b22c1925274dee71596d940',
                '0x66e3792dc624ecafb28cc744762d63c6016ed29bc5c5bdf409ade7fc112a52ec',
                '0x172a483415c5e119f1ea336d44646572ac34a088e7bc2884f8e1f83da4cb304a'
            ]
        },
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
};

export default config;
