use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, MintTo, Token};

declare_id!("6NvWeuE9C2bfJ9cd2d2vBXf935p4BNhTCJwLnVoxm7s3");

#[program]
pub mod solana_nft {
    use super::*;

    pub fn mint_nft(ctx: Context<MintNFT>, uri: String) -> Result<()> {
        let nft_account = &mut ctx.accounts.nft_account;
        nft_account.owner = *ctx.accounts.owner.key;
        nft_account.uri = uri;
        Ok(())
    }

    pub fn transfer_nft(ctx: Context<TransferNFT>) -> Result<()> {
        let nft_account = &mut ctx.accounts.nft_account;

        require_keys_eq!(nft_account.owner, *ctx.accounts.current_owner.key, CustomError::Unauthorized);

        nft_account.owner = *ctx.accounts.new_owner.key;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(init, payer = owner, space = 8 + 32 + 200)]
    pub nft_account: Account<'info, NFT>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferNFT<'info> {
    #[account(mut)]
    pub nft_account: Account<'info, NFT>,
    #[account(signer)]
    pub current_owner: Signer<'info>,
    
    #[account(mut)]
    pub new_owner: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NFT {
    pub owner: Pubkey,
    pub uri: String,
}

#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
}
