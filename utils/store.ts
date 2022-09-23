import { createTypedHooks } from 'easy-peasy';
import { Action, action } from 'easy-peasy';
import { createStore, persist } from 'easy-peasy';

interface WalletStore { connected: boolean, name: string, address: string }
interface peerStore { address: string, balance: number}

interface StoreModel {
  wallet: WalletStore
  setWallet: Action<StoreModel, WalletStore>
  availableWallets: string[]
  setAvailableWallets: Action<StoreModel, string[]>
  }

const model: StoreModel = {
  wallet: { connected: false, name: '', address: '' },
  setWallet: action((state, newWallet) => { state.wallet = newWallet }),
  availableWallets: [],
  setAvailableWallets: action((state, newAvailableWallets) => { state.availableWallets = newAvailableWallets }),

}

const store = createStore(persist(model))
export default store


const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<StoreModel>()

export {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
}