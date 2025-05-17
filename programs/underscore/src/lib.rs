pub mod switchboard;
pub mod amm;

use switchboard::*;
use amm::*;

#[program]
pub mod underscore {
    use super::*;

    pub fn fetch_score(ctx: Context<ReadOracle>) -> Result<()> {
        read(ctx)
    }

    // example AMM function
    pub fn some_amm_function(ctx: Context<SomeContext>) -> Result<()> {
        amm::do_something(ctx)
    }
}
