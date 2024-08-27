import React, { FC, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, Idl } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from "../IDL.json"
import axios from 'axios'; 

const programID = new PublicKey('6NvWeuE9C2bfJ9cd2d2vBXf935p4BNhTCJwLnVoxm7s3');

const MintNFT: FC = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const uploadToIPFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: '3f31e87e21efab6b00d7',
          pinata_secret_api_key: '4ef9a8b47bc121b43038a1f1172f02ae9d750b72f97c1b479b5148a2dccd6535',
        },
      });
      console.log(res.data.IpfsHash);
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!wallet || !file) {
      console.error('Wallet not connected or no file selected');
      return;
    }

    try {
      const uri = await uploadToIPFS(file);
      const provider = new AnchorProvider(connection, wallet, {
        preflightCommitment: 'processed',
      });
      const program = new Program(idl as unknown as Idl, programID, provider);
      console.log("Program: ", program);
      const [nftAccount] = PublicKey.findProgramAddressSync(
        [wallet.publicKey.toBuffer()],
        program.programId
      );

      console.log(`NFT Account Address: ${nftAccount.toBase58()}`);

      await program.methods.mintNft(uri).accounts({
        nft_account: nftAccount,
        owner: wallet.publicKey,
        system_program: web3.SystemProgram.programId,
      }).rpc();

      alert('NFT minted successfully!');
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Failed to mint NFT');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-purple-600 mb-6">Mint Your NFT</h1>
        <form onSubmit={handleMint} className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Mint NFT
          </button>
        </form>
      </div>
    </div>
  );
};

export default MintNFT;
