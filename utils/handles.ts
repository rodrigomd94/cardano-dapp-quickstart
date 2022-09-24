export const queryHandle = async (handleName: string) => {

  const policyID = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';
  // A blank Handle name should always be ignored.
  if (handleName.length === 0) {
      // Handle error.
  }
  // Convert handleName to hex encoding.
  const assetName = Buffer.from(handleName.toLowerCase()).toString('hex');

  // Fetch matching address for the asset.
  const data = await fetch(
      `https://cardano-mainnet.blockfrost.io/api/v0/assets/${policyID}${assetName}/addresses`,
      {
          headers: {
              // Your Blockfrost API key
              project_id: process.env.NEXT_PUBLIC_BLOCKFROST,
              'Content-Type': 'application/json'
          }
      }
  ).then(res => res.json());

  if (data?.error) {
      // Handle error.
      console.log("handle error")
  }

  const [{ address }] = data;
  return (address)
}

export const handleFromAddress = async (address: string) => {

  const policyID = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';
  // A blank Handle name should always be ignored.
  if (address.length === 0) {
      // Handle error.
  }
  // Convert handleName to hex encoding.
  //const assetName = Buffer.from(handleName.toLowerCase()).toString('hex');

  // Fetch matching address for the asset.
  try {

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
          console.log("handle error")
      }

      const amount = data['amount']
      var handles : string[]= []
      amount.map((asset: any) => {
          if (asset.unit.startsWith(policyID)) {
              let handle = '$' + Buffer.from(asset.unit.replace(policyID, ''), 'hex').toString()
              handles.push(handle)
          }
      })
  } catch (e) {
      console.log("error:", e)
  }

  return (handles)
}