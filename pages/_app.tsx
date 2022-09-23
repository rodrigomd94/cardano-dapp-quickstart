import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { StoreProvider } from 'easy-peasy'
import store from '../utils/store'

function MyApp({ Component, pageProps }: AppProps) {
  
  const StoreProviderOverride = StoreProvider as any;
  return(
    <StoreProviderOverride store={store}>
      <Component {...pageProps} />
    </StoreProviderOverride>
    )
}

export default MyApp