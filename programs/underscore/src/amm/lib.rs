use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("AMMDEMo11111111111111111111111111111111111111");

#[program]
pub mod amm_demo {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>) -> Result<()> {
        ctx.accounts.pool.token_a_balance = 0;
        ctx.accounts.pool.token_b_balance = 0;
        Ok(())
    }

    pub fn add_liquidity(ctx: Context<AddLiquidity>, amount_a: u64, amount_b: u64) -> Result<()> {
        ctx.accounts.pool.token_a_balance = ctx.accounts.pool.token_a_balance.checked_add(amount_a).unwrap();
        ctx.accounts.pool.token_b_balance = ctx.accounts.pool.token_b_balance.checked_add(amount_b).unwrap();

        token::transfer(ctx.accounts.into_transfer_a(), amount_a)?;
        token::transfer(ctx.accounts.into_transfer_b(), amount_b)?;
        Ok(())
    }

    pub fn swap_a_for_b(ctx: Context<Swap>, amount_in: u64) -> Result<()> {
        let amount_out = calculate_out(
            amount_in,
            ctx.accounts.pool.token_a_balance,
            ctx.accounts.pool.token_b_balance,
        );

        ctx.accounts.pool.token_a_balance = ctx.accounts.pool.token_a_balance.checked_add(amount_in).unwrap();
        ctx.accounts.pool.token_b_balance = ctx.accounts.pool.token_b_balance.checked_sub(amount_out).unwrap();

        token::transfer(ctx.accounts.into_transfer_in(), amount_in)?;
        token::transfer(ctx.accounts.into_transfer_out(), amount_out)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(init, payer = payer, space = 8 + 8 + 8)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddLiquidity<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub from_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub from_b: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub pool: Account<'info, Pool>,
    #[account(mut)]
    pub from: Account<'info, TokenAccount>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub vault_b: Account<'info, TokenAccount>,
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Pool {
    pub token_a_balance: u64,
    pub token_b_balance: u64,
}

fn calculate_out(amount_in: u64, reserve_in: u64, reserve_out: u64) -> u64 {
    let input_amount_with_fee = amount_in.checked_mul(997).unwrap();
    let numerator = input_amount_with_fee.checked_mul(reserve_out).unwrap();
    let denominator = reserve_in.checked_mul(1000).unwrap().checked_add(input_amount_with_fee).unwrap();
    numerator / denominator
}

impl<'info> AddLiquidity<'info> {
    fn into_transfer_a(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.from_a.to_account_info(),
            to: self.vault_a.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    fn into_transfer_b(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.from_b.to_account_info(),
            to: self.vault_b.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}

impl<'info> Swap<'info> {
    fn into_transfer_in(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.from.to_account_info(),
            to: self.vault_a.to_account_info(),
            authority: self.user.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    fn into_transfer_out(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.vault_b.to_account_info(),
            to: self.to.to_account_info(),
            authority: self.user.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}
