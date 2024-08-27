import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  WalletProvider,
} from '@solana/wallet-adapter-react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ConnectionProvider } from '@solana/wallet-adapter-react';

import '@solana/wallet-adapter-react-ui/styles.css';

const network = WalletAdapterNetwork.Devnet; 

const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter({ network }),
  new TorusWalletAdapter(),
];

const endpoint = "https://api.devnet.solana.com"; 

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <App />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </React.StrictMode>
);
