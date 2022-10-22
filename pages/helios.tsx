import type { NextPage } from 'next'
import Head from 'next/head'
import WalletConnect from '../components/WalletConnect'
import { useStoreActions, useStoreState } from "../utils/store"
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getAssets } from "../utils/cardano";
import NftGrid from "../components/NftGrid";
import initLucid from '../utils/lucid'
import { Lucid, TxHash, Lovelace, Constr, SpendingValidator, Data } from 'lucid-cardano'
import * as helios from '@hyperionbt/helios'


const Helios: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet)
  const [nftList, setNftList] = useState([])
  const [lucid, setLucid] = useState<Lucid>()
  const [script, setScript] = useState<SpendingValidator>()
  const [scriptAddress, setScriptAddress] = useState("")


  useEffect(() => {
    if (lucid) {
      const thisScript: SpendingValidator = {
        type: "PlutusV1",
        script: JSON.parse(
          helios.Program.new(`
          spending matching_pubKeyHash
          struct Datum {
              owner: PubKeyHash
          }
          struct Redeemer {
              owner: PubKeyHash
          }
          func main(datum : Datum, redeemer: Redeemer) -> Bool {datum.owner == redeemer.owner}
      `).compile().serialize(),
        ).cborHex,
      };
      setScript(thisScript)
      setScriptAddress(lucid.utils.validatorToAddress(thisScript))
    } else {
      initLucid(walletStore.name).then((Lucid: Lucid) => { setLucid(Lucid) })
    }
  }, [lucid])

  const lockUtxo = async (lovelace: Lovelace) => {
    if (lucid) {
      const { paymentCredential } = lucid.utils.getAddressDetails(
        await lucid.wallet.address(),
      );

      // This represents the Datum struct from the Helios on-chain code
      const datum = Data.to(
        new Constr(0, [new Constr(0, [paymentCredential?.hash!])]),
      );

      const tx = await lucid.newTx().payToContract(scriptAddress, datum, {
        lovelace,
      })
        .complete();
      const signedTx = await tx.sign().complete();
      console.log(await signedTx.submit());
    }

  }

  const redeemUtxo = async () => {
    if (lucid) {
      const { paymentCredential } = lucid.utils.getAddressDetails(
        await lucid.wallet.address(),
      );

      // This represents the Redeemer struct from the Helios on-chain code
      const redeemer = Data.to(
        new Constr(0, [new Constr(0, [paymentCredential?.hash!])]),
      );

      const [utxo] = await lucid.utxosAt(scriptAddress);

      const tx = await lucid.newTx().collectFrom([utxo], redeemer)
        .attachSpendingValidator(script as SpendingValidator)
        .complete();

      const signedTx = await tx.sign().complete();
      console.log(await signedTx.submit());
    }
  }

  return (
    <div className="px-10">
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">Cardano</Link>
        </div>
        <div className="flex-none">
          <WalletConnect />
        </div>
      </div>
      <div>Address: {walletStore.address}</div>
      <div className='m-10'>
        <p>
          MatchingPubKeyHash Example
          Lock a UTxO with a PubKeyHash
          UTxO can be unlocked by providing the same PubKeyHash in the redeemer
          Showcasing Helios; Link: https://github.com/Hyperion-BT/Helios
        </p>

      </div>
      <div className="mx-40 my-10">
        <button className="btn btn-primary m-5" onClick={() => { lockUtxo(BigInt(1000000)) }} >Deposit</button>
        <button className="btn btn-secondary m-5" onClick={() => { redeemUtxo() }}>Unlock</button>
      </div>
    </div>
  )
}

export default Helios
