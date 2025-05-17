use anchor_lang::prelude::*;
use switchboard_v2::AggregatorAccountData;

#[derive(Accounts)]
pub struct ReadOracle<'info> {
    pub switchboard_program: Program<'info, SwitchboardV2>,
    #[account()]
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,
}

pub fn read(ctx: Context<ReadOracle>) -> Result<()> {
    let data = ctx.accounts.aggregator.load()?;
    let val = data.get_result()?.try_into().unwrap();
    msg!("Oracle Value: {:?}", val);
    Ok(())
}
