export const getAssets = async (address: string) => {
    var allNFTs = []
    var addressInfo = { nfts: allNFTs, balance: 0 }
    const data = await fetch(
        `https://cardano-mainnet.blockfrost.io/api/v0/addresses/${address}`,
        {
            headers: {
                // Your Blockfrost API key
                project_id: process.env.NEXT_PUBLIC_BLOCKFROST,
                'Content-Type': 'application/json'
            }
        }
    ).then(res => res.json());
    console.log(data)
    if (data?.error) {
        // Handle error.
        console.log("error")
    }

    const amount = data['amount']
    if (amount.length > 0) {
        amount.map(async (asset) => {
            //var allNFTs = []
            if (asset.unit !== "lovelace") {
                const data = await fetch(
                    `https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset.unit}`,
                    {
                        headers: {
                            // Your Blockfrost API key
                            project_id: process.env.NEXT_PUBLIC_BLOCKFROST,
                            'Content-Type': 'application/json'
                        }
                    }
                ).then(res => res.json());
                const meta = data['onchain_metadata'];
                if (meta && meta.image) {
                    allNFTs.push({ ...meta, assetId: data.asset })
                } else {
                    //   console.log("nometa", data)
                }
            } else if (asset.unit === 'lovelace') {
                addressInfo.balance === asset.quantity
            }
        })
    }
    return { addressInfo }
}