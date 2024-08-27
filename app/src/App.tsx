import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { WalletMultiButton} from '@solana/wallet-adapter-react-ui';
import MintNFT from './components/MintNFT';
import DisplayNFTs from './components/DisplayNFTs';

function App() {

  return (
    <div className='bg-gray-800'>
        <Router>
      <div className="bg-gray-800">
        <header className="App-header flex justify-between items-center p-4 bg-gray-800 text-white">
          <div>
            <h1 className="text-2xl font-bold">Solana NFT Platform</h1>
          </div>
          <nav className="flex space-x-4">
            <Link to="/mint" className="text-blue-500 hover:underline">
              Mint NFT
            </Link>
            <Link to="/display" className="text-blue-500 hover:underline">
              Display NFTs
            </Link>
          </nav>
          <div className="flex space-x-4">
            <WalletMultiButton />
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/mint" element={<MintNFT />} />
            <Route path="/display" element={<DisplayNFTs />} />
            <Route path="/" element={<MintNFT />} /> 
          </Routes>
        </main>
      </div>
    </Router>
    </div>
  )
}

export default App;

