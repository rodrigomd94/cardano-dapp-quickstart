import { Blockfrost, Lucid } from 'lucid-cardano';

const initLucid = async (wallet: string) => {
    const api = (await window.cardano[
        wallet.toLowerCase()
    ].enable())

    const lucid = await Lucid.new(
        new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', process.env.NEXT_PUBLIC_BLOCKFROST as string),
        'Mainnet')
    lucid.selectWallet(api)
    //setLucid(lucid)
    return lucid;
}

export default initLucid;