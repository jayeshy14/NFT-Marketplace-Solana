import { FC, useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from "../IDL.json"

const programID = new PublicKey('6NvWeuE9C2bfJ9cd2d2vBXf935p4BNhTCJwLnVoxm7s3');

const DisplayNFTs: FC = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [nfts, setNfts] = useState<any[]>([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!wallet) return;

      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'processed',
      });
      const program = new Program(idl as unknown as Idl, programID, provider);

      try {
        const accounts = await program.account.nft.all();
        setNfts(accounts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      }
    };

    fetchNFTs();
  }, [wallet, connection]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-purple-600 mb-6">Minted NFTs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {nfts.map((nft, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
            <img src={nft.account.uri} alt={`NFT ${index}`} className="w-full h-auto mb-4 rounded" />
            <p className="text-sm text-gray-600">Owner: {nft.account.owner.toBase58()}</p>
            <p className="text-sm text-gray-600">URI: {nft.account.uri}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayNFTs;
