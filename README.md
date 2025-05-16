<p align="center">
  <img src="https://ik.imagekit.io/d2v6okduo/Frame%2010.png?updatedAt=1747417360163" alt="Under_Score Logo" width="250"/>
</p>

# Under_Score

Under_Score is a decentralized sports betting application built on the Solana blockchain. It leverages decentralized oracle technology (Switchboard) to provide real-time verified sports data, and employs Automated Market Makers (AMM) to dynamically calculate betting odds. Under_Score ensures transparency, fairness, and instant payouts through smart contracts, making blockchain-based sports betting accessible and trustworthy for users worldwide.

---

## Features

- **Decentralized & On-Chain:** Entire betting lifecycle — from placing bets to payouts — is handled on-chain via Solana smart contracts.
- **Real-Time Verified Data:** Uses Switchboard Oracles to fetch and verify live match data from multiple sources, guaranteeing accurate and tamper-proof results.
- **Automated Market Maker (AMM) Odds:** Odds are dynamically adjusted based on the betting pool liquidity and current bets, following a constant product formula (X × Y = K).
- **Instant Payouts:** Smart contracts automatically disburse winnings to users immediately after match results are finalized.
- **User-Friendly UI:** Designed for accessibility — intuitive and easy to use for all age groups.
- **Global Leaderboard:** Showcases top winners while respecting user privacy with masked addresses and avatars.

---

## How It Works

1. **Admin Liquidity Provision:**  
   The admin seeds the liquidity pool for each match, splitting funds equally between the competing teams. Initially, the draw odds are set to zero.

   ```rust
   // Example snippet: Admin providing liquidity (pseudo-code)
   fn seed_liquidity(admin_wallet: &Wallet, match_id: u64, amount: u64) -> Result<()> {
       let half = amount / 2;
       liquidity_pool[match_id].team_a += half;
       liquidity_pool[match_id].team_b += half;
       liquidity_pool[match_id].draw = 0;
       Ok(())
   }


2. **Bet Placement:**
   Users place bets on Team A, Team B, or a Draw. Odds adjust dynamically using AMM logic to keep the product of available liquidity constant.

   ```rust
   // AMM odds adjustment logic (simplified)
   // X = liquidity_team_a, Y = liquidity_team_b, K = constant liquidity
   // When user bets on Team A:
   // X_new = X + bet_amount
   // Y_new = K / X_new
   // New odds calculated accordingly
   fn update_odds(match_id: u64, bet_on: Team, bet_amount: u64) {
       let (x, y) = (liquidity_pool[match_id].team_a, liquidity_pool[match_id].team_b);
       let k = x * y;
       if bet_on == Team::A {
           let x_new = x + bet_amount;
           let y_new = k / x_new;
           // Calculate odds based on x_new and y_new
       }
       // Similar logic for Team B and Draw
   }
   ```

3. **Oracle-Verified Results:**
   Switchboard Oracle fetches live match scores and results from multiple external sources and pushes verified outcomes on-chain.

4. **Automated Payouts:**
   Smart contracts trigger automatic payout distribution to winning bettors, using escrowed liquidity pools.

   ```rust
   fn distribute_winnings(match_id: u64, winning_team: Team) {
       let winners = get_bettors_on_team(match_id, winning_team);
       let total_pool = get_total_liquidity(match_id);
       for winner in winners {
           let payout = calculate_payout(winner.bet_amount, total_pool);
           transfer_tokens(winner.address, payout);
       }
   }
   ```

---

## Installation & Setup

### Prerequisites

* [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) installed and configured.
* Rust toolchain (`rustup`) installed.
* Access to Switchboard Oracle API keys.

### Deploying Smart Contracts

```bash
git clone https://github.com/your-org/underscore.git
cd underscore

cargo build-bpf

solana program deploy path/to/your_program.so
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Usage

* **Admin:** Use the admin panel to add matches and seed liquidity pools.
* **Users:** Connect a Solana-compatible wallet, browse available matches, and place bets with dynamic odds displayed in real-time.
* **Results:** Winners receive instant payouts after match results are verified and posted by the oracle.

---

## Roadmap

* Q3 2025: Integrate esports betting.
* Q4 2025: Add chess, tennis, and rugby football markets.
* 2026: Launch native token for betting, staking, and governance.
* Continued UI/UX improvements for better accessibility.

---

## Contributing

We welcome contributions! Please open issues or submit pull requests to help improve Under\_Score.

---

## License

MIT License © 2025 Under\_Score Team

---

## Contact

For questions or partnership inquiries, please reach out to any of the following emails:

* [urmaliyadiv04@gmail.com](mailto:urmaliyadiv04@gmail.com)
* [Akshatmaurya25@gmail.com](mailto:Akshatmaurya25@gmail.com)
* [skartik1706@gmail.com](mailto:skartik1706@gmail.com)
* [pranesh25joshi@gmail.com](mailto:pranesh25joshi@gmail.com)
* [tuspatidar2311@gmail.com](mailto:tuspatidar2311@gmail.com)
* [tripathiyatharth257@gmail.com](mailto:tripathiyatharth257@gmail.com)

Follow us on Twitter: [@Under\_Score\_Sol](https://twitter.com/Under_Score_Sol)

---

*Under\_Score — Bet Fair, Win Fast, On-Chain.*

```
```
