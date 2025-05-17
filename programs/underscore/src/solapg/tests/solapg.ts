import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { SolanaAnchorApp } from '../target/types/solana_anchor_app';
import { PublicKey, LAMPORTS_PER_SOL, SystemProgram } from '@solana/web3.js';
import { expect } from 'chai';
import { BN } from 'bn.js';

describe('Betting Market Tests', () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaAnchorApp as Program<SolanaAnchorApp>;
  
  // Test accounts
  const admin = anchor.web3.Keypair.generate();
  const user1 = anchor.web3.Keypair.generate();
  const user2 = anchor.web3.Keypair.generate();
  
  // Market account
  const market = anchor.web3.Keypair.generate();
  
  // Test constants
  const marketName = "World Cup Final";
  const outcomeA = "France";
  const outcomeB = "Argentina";
  const betAmount1 = new BN(1 * LAMPORTS_PER_SOL); // 1 SOL
  const betAmount2 = new BN(2 * LAMPORTS_PER_SOL); // 2 SOL
  
  // PDA for bet accounts
  let user1BetPDA: PublicKey;
  let user1BetBump: number;
  let user2BetPDA: PublicKey;
  let user2BetBump: number;
  
  // Prepare accounts before running tests
  before(async () => {
    console.log("Setting up test environment...");
    
    // Airdrop SOL to admin and users
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(admin.publicKey, 10 * LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user1.publicKey, 10 * LAMPORTS_PER_SOL)
    );
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(user2.publicKey, 10 * LAMPORTS_PER_SOL)
    );
    
    console.log("Admin account:", admin.publicKey.toString());
    console.log("User1 account:", user1.publicKey.toString());
    console.log("User2 account:", user2.publicKey.toString());
    
    // Find PDAs for bet accounts
    [user1BetPDA, user1BetBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("bet"),
        market.publicKey.toBuffer(),
        user1.publicKey.toBuffer(),
      ],
      program.programId
    );
    
    [user2BetPDA, user2BetBump] = await PublicKey.findProgramAddress(
      [
        Buffer.from("bet"),
        market.publicKey.toBuffer(),
        user2.publicKey.toBuffer(),
      ],
      program.programId
    );
    
    console.log("User1 bet PDA:", user1BetPDA.toString());
    console.log("User2 bet PDA:", user2BetPDA.toString());
  });
  
  it("Creates a new betting market", async () => {
    console.log("Testing create_bet_market instruction...");
    
    try {
      // Call create_bet_market instruction
      await program.methods
        .createBetMarket(marketName, outcomeA, outcomeB)
        .accounts({
          market: market.publicKey,
          admin: admin.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([admin, market])
        .rpc();
      
      // Fetch the created market account to verify
      const marketAccount = await program.account.market.fetch(market.publicKey);
      
      // Debug output
      console.log("Market created with data:", {
        name: marketAccount.name,
        outcomeA: marketAccount.outcomeA,
        outcomeB: marketAccount.outcomeB,
        creator: marketAccount.creator.toString(),
        totalPool: marketAccount.totalPool.toString(),
        isResolved: marketAccount.isResolved,
      });
      
      // Verify market data
      expect(marketAccount.name).to.equal(marketName);
      expect(marketAccount.outcomeA).to.equal(outcomeA);
      expect(marketAccount.outcomeB).to.equal(outcomeB);
      expect(marketAccount.creator.toString()).to.equal(admin.publicKey.toString());
      expect(marketAccount.totalPool.toNumber()).to.equal(0);
      expect(marketAccount.outcomeAPool.toNumber()).to.equal(0);
      expect(marketAccount.outcomeBPool.toNumber()).to.equal(0);
      expect(marketAccount.isResolved).to.be.false;
      expect(marketAccount.winningOutcome).to.be.null;
      
    } catch (error) {
      console.error("Error creating betting market:", error);
      throw error;
    }
  });
  
  it("User1 places a bet on outcome A", async () => {
    console.log("Testing place_bet instruction for User1...");
    
    // Get initial balances for comparison
    const initialMarketBalance = await provider.connection.getBalance(market.publicKey);
    const initialUser1Balance = await provider.connection.getBalance(user1.publicKey);
    
    console.log("Initial balances:", {
      market: initialMarketBalance,
      user1: initialUser1Balance,
    });
    
    try {
      // User1 places a bet on outcome A (0)
      await program.methods
        .placeBet(betAmount1, 0) // 0 for outcome A
        .accounts({
          market: market.publicKey,
          bet: user1BetPDA,
          user: user1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      
      // Fetch accounts after bet
      const marketAccount = await program.account.market.fetch(market.publicKey);
      const betAccount = await program.account.bet.fetch(user1BetPDA);
      
      // Check updated balances
      const finalMarketBalance = await provider.connection.getBalance(market.publicKey);
      const finalUser1Balance = await provider.connection.getBalance(user1.publicKey);
      
      console.log("After bet balances:", {
        market: finalMarketBalance,
        user1: finalUser1Balance,
        difference: {
          market: finalMarketBalance - initialMarketBalance,
          user1: initialUser1Balance - finalUser1Balance,
        }
      });
      
      // Debug output
      console.log("Market state after User1 bet:", {
        totalPool: marketAccount.totalPool.toString(),
        outcomeAPool: marketAccount.outcomeAPool.toString(),
        outcomeBPool: marketAccount.outcomeBPool.toString(),
      });
      
      console.log("User1 bet details:", {
        user: betAccount.user.toString(),
        amount: betAccount.amount.toString(),
        outcome: betAccount.outcome,
      });
      
      // Verify market state
      expect(marketAccount.totalPool.toString()).to.equal(betAmount1.toString());
      expect(marketAccount.outcomeAPool.toString()).to.equal(betAmount1.toString());
      expect(marketAccount.outcomeBPool.toNumber()).to.equal(0);
      
      // Verify bet account
      expect(betAccount.user.toString()).to.equal(user1.publicKey.toString());
      expect(betAccount.amount.toString()).to.equal(betAmount1.toString());
      expect(betAccount.outcome).to.equal(0);
      
      // Verify SOL transfer (with tolerance for transaction fees)
      const expectedUser1Difference = betAmount1.toNumber() + 5000; // Adding buffer for tx fee
      const actualUser1Difference = initialUser1Balance - finalUser1Balance;
      expect(actualUser1Difference).to.be.approximately(expectedUser1Difference, 10000);
      expect(finalMarketBalance - initialMarketBalance).to.equal(betAmount1.toNumber());
      
    } catch (error) {
      console.error("Error placing bet for User1:", error);
      throw error;
    }
  });
  
  it("User2 places a bet on outcome B", async () => {
    console.log("Testing place_bet instruction for User2...");
    
    const initialMarketBalance = await provider.connection.getBalance(market.publicKey);
    const initialUser2Balance = await provider.connection.getBalance(user2.publicKey);
    
    try {
      // User2 places a bet on outcome B (1)
      await program.methods
        .placeBet(betAmount2, 1) // 1 for outcome B
        .accounts({
          market: market.publicKey,
          bet: user2BetPDA,
          user: user2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();
      
      // Fetch accounts after bet
      const marketAccount = await program.account.market.fetch(market.publicKey);
      const betAccount = await program.account.bet.fetch(user2BetPDA);
      
      // Check updated balances
      const finalMarketBalance = await provider.connection.getBalance(market.publicKey);
      const finalUser2Balance = await provider.connection.getBalance(user2.publicKey);
      
      console.log("After bet balances:", {
        market: finalMarketBalance,
        user2: finalUser2Balance,
        difference: {
          market: finalMarketBalance - initialMarketBalance,
          user2: initialUser2Balance - finalUser2Balance,
        }
      });
      
      // Debug output
      console.log("Market state after User2 bet:", {
        totalPool: marketAccount.totalPool.toString(),
        outcomeAPool: marketAccount.outcomeAPool.toString(),
        outcomeBPool: marketAccount.outcomeBPool.toString(),
      });
      
      // Verify market state
      const expectedTotalPool = betAmount1.add(betAmount2).toString();
      expect(marketAccount.totalPool.toString()).to.equal(expectedTotalPool);
      expect(marketAccount.outcomeAPool.toString()).to.equal(betAmount1.toString());
      expect(marketAccount.outcomeBPool.toString()).to.equal(betAmount2.toString());
      
      // Verify bet account
      expect(betAccount.user.toString()).to.equal(user2.publicKey.toString());
      expect(betAccount.amount.toString()).to.equal(betAmount2.toString());
      expect(betAccount.outcome).to.equal(1);
      
      // Verify SOL transfer
      const expectedUser2Difference = betAmount2.toNumber() + 5000; // Adding buffer for tx fee
      const actualUser2Difference = initialUser2Balance - finalUser2Balance;
      expect(actualUser2Difference).to.be.approximately(expectedUser2Difference, 10000);
      expect(finalMarketBalance - initialMarketBalance).to.equal(betAmount2.toNumber());
      
    } catch (error) {
      console.error("Error placing bet for User2:", error);
      throw error;
    }
  });
  
  it("Cannot place a bet on a non-existent outcome", async () => {
    console.log("Testing invalid outcome validation...");
    
    try {
      // Try to place a bet with invalid outcome (2)
      await program.methods
        .placeBet(betAmount1, 2) // Invalid outcome (only 0 and 1 are valid)
        .accounts({
          market: market.publicKey,
          bet: user1BetPDA, // Reusing the same PDA will fail anyway
          user: user1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      
      // Should not reach here
      expect.fail("Transaction should have failed with invalid outcome");
      
    } catch (error) {
      // Debug output
      console.log("Error correctly thrown for invalid outcome:", error.message);
      
      // Verify the error is about invalid outcome
      expect(error.message).to.include("InvalidOutcome");
    }
  });
  
  it("Resolves the market with outcome B as winner", async () => {
    console.log("Testing resolve_market instruction...");
    
    try {
      // Admin resolves the market, declaring outcome B (1) as winner
      await program.methods
        .resolveMarket(1) // 1 for outcome B
        .accounts({
          market: market.publicKey,
          admin: admin.publicKey,
        })
        .signers([admin])
        .rpc();
      
      // Fetch market account to verify resolution
      const marketAccount = await program.account.market.fetch(market.publicKey);
      
      // Debug output
      console.log("Market resolved with state:", {
        isResolved: marketAccount.isResolved,
        winningOutcome: marketAccount.winningOutcome,
      });
      
      // Verify market state
      expect(marketAccount.isResolved).to.be.true;
      expect(marketAccount.winningOutcome).to.not.be.null;
      expect(marketAccount.winningOutcome).to.equal(1); // outcome B
      
    } catch (error) {
      console.error("Error resolving market:", error);
      throw error;
    }
  });
  
  it("Non-admin cannot resolve the market", async () => {
    console.log("Testing unauthorized market resolution...");
    
    try {
      // User1 tries to resolve the market (should fail)
      await program.methods
        .resolveMarket(0)
        .accounts({
          market: market.publicKey,
          admin: user1.publicKey,
        })
        .signers([user1])
        .rpc();
      
      // Should not reach here
      expect.fail("Transaction should have failed with unauthorized error");
      
    } catch (error) {
      // Debug output
      console.log("Error correctly thrown for unauthorized resolution:", error.message);
      
      // Verify the error is about unauthorized access
      expect(error.message).to.include("Unauthorized");
    }
  });
  
  it("Cannot resolve an already resolved market", async () => {
    console.log("Testing double resolution prevention...");
    
    try {
      // Admin tries to resolve the market again
      await program.methods
        .resolveMarket(0)
        .accounts({
          market: market.publicKey,
          admin: admin.publicKey,
        })
        .signers([admin])
        .rpc();
      
      // Should not reach here
      expect.fail("Transaction should have failed with already resolved error");
      
    } catch (error) {
      // Debug output
      console.log("Error correctly thrown for already resolved market:", error.message);
      
      // Verify the error is about market already being resolved
      expect(error.message).to.include("AlreadyResolved");
    }
  });
  
  it("User2 claims winnings as outcome B bettor", async () => {
    console.log("Testing claim_winnings instruction for winning User2...");
    
    const initialMarketBalance = await provider.connection.getBalance(market.publicKey);
    const initialUser2Balance = await provider.connection.getBalance(user2.publicKey);
    
    console.log("Initial balances before claim:", {
      market: initialMarketBalance,
      user2: initialUser2Balance,
    });
    
    try {
      // User2 claims winnings (bet on outcome B which won)
      await program.methods
        .claimWinnings()
        .accounts({
          market: market.publicKey,
          bet: user2BetPDA,
          user: user2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user2])
        .rpc();
      
      // Check updated balances
      const finalMarketBalance = await provider.connection.getBalance(market.publicKey);
      const finalUser2Balance = await provider.connection.getBalance(user2.publicKey);
      
      console.log("After claim balances:", {
        market: finalMarketBalance,
        user2: finalUser2Balance,
        difference: {
          market: initialMarketBalance - finalMarketBalance,
          user2: finalUser2Balance - initialUser2Balance,
        }
      });
      
      // Calculate expected winnings based on the formula
      // winnings = (bet_amount * total_pool) / winning_pool
      const totalPool = betAmount1.add(betAmount2);
      const winningPool = betAmount2;
      const expectedWinnings = betAmount2.mul(totalPool).div(winningPool);
      
      console.log("Expected winnings:", expectedWinnings.toString());
      
      // Verify the SOL transfer (with tolerance for transaction fees)
      const actualUser2Difference = finalUser2Balance - initialUser2Balance;
      const actualMarketDifference = initialMarketBalance - finalMarketBalance;
      
      console.log("Actual differences:", {
        user2: actualUser2Difference,
        market: actualMarketDifference,
      });
      
      // Allow for transaction fees in the comparison
      expect(actualUser2Difference).to.be.approximately(
        expectedWinnings.toNumber() - 5000, // Subtract tx fee buffer
        10000 // Tolerance
      );
      expect(actualMarketDifference).to.equal(expectedWinnings.toNumber());
      
    } catch (error) {
      console.error("Error claiming winnings for User2:", error);
      throw error;
    }
  });
  
  it("User1 cannot claim winnings as outcome A bettor", async () => {
    console.log("Testing claim_winnings rejection for losing User1...");
    
    try {
      // User1 tries to claim winnings (bet on outcome A which lost)
      await program.methods
        .claimWinnings()
        .accounts({
          market: market.publicKey,
          bet: user1BetPDA,
          user: user1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      
      // Should not reach here
      expect.fail("Transaction should have failed with not winner error");
      
    } catch (error) {
      // Debug output
      console.log("Error correctly thrown for non-winner claim:", error.message);
      
      // Verify the error is about not being a winner
      expect(error.message).to.include("NotWinner");
    }
  });
  
  it("Another user cannot claim User2's winnings", async () => {
    console.log("Testing unauthorized claim prevention...");
    
    try {
      // User1 tries to claim User2's winnings
      await program.methods
        .claimWinnings()
        .accounts({
          market: market.publicKey,
          bet: user2BetPDA, // User2's bet
          user: user1.publicKey, // User1 trying to claim
          systemProgram: SystemProgram.programId,
        })
        .signers([user1])
        .rpc();
      
      // Should not reach here
      expect.fail("Transaction should have failed with unauthorized error");
      
    } catch (error) {
      // Debug output
      console.log("Error correctly thrown for unauthorized claim:", error.message);
      
      // This will likely fail due to PDA validation constraints
      expect(error.message).to.include("Unauthorized");
    }
  });
});