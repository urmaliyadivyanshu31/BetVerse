import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { OracleJob } from '@switchboard-xyz/common';
import { PullFeed } from '@switchboard-xyz/on-demand';
import * as anchor from '@coral-xyz/anchor';

// Configuration
const RPC_URL = 'https://api.devnet.solana.com';
const WALLET_PRIVATE_KEY = process.env.SOLANA_WALLET_PRIVATE_KEY || '';
const QUEUE_ADDRESS = 'EYiAmGSdsQTuCw413V5BzaruWuCCSDgTPtBGvLkXHbe7';


const connection = new Connection(RPC_URL, 'confirmed');
let keypair: Keypair;
try {
  keypair = Keypair.fromSecretKey(Uint8Array.from(Buffer.from(WALLET_PRIVATE_KEY, 'base58')));
} catch (error) {
  throw new Error('Invalid wallet private key');
}
const wallet = new anchor.Wallet(keypair);

const job = new OracleJob({
  tasks: [
    {
      valueTask: {
        value: 0 
      }
    }
  ]
});

async function createFeed() {
  try {
 
    const feedKeypair = Keypair.generate();
    const feed = new PullFeed(
      {
        connection,
        wallet,
        programId: new PublicKey('BkEGzSgjk1HyiDfbGFzUYyXAx5gH8wAP2G41dRykRHyL')
      },
      feedKeypair.publicKey
    );
    const tx = await feed.create({
      queue: new PublicKey(QUEUE_ADDRESS),
      jobs: [job],
      minRequiredResponses: 1,
      maxVariance: 500, // 5%
      minUpdateDelaySeconds: 30,
      maxStalenessSeconds: 60,
      crank: true // Enable crank updates
    });

    const sig = await connection.sendTransaction(tx, [keypair, feedKeypair], {
      preflightCommitment: 'processed'
    });
    console.log(`Feed created: ${feedKeypair.publicKey.toBase58()}`);
    console.log(`Transaction signature: ${sig}`);

    const leaseTx = await feed.fundLease({
      fundAmount: 0.05 * anchor.web3.LAMPORTS_PER_SOL
    });
    const leaseSig = await connection.sendTransaction(leaseTx, [keypair], {
      preflightCommitment: 'processed'
    });
    console.log(`Lease funded: ${leaseSig}`);

    return feedKeypair.publicKey.toBase58();
  } catch (error) {
    console.error('Error creating feed:', (error as Error).message);
    throw error;
  }
}

createFeed()
  .then((feedAddress) => {
    console.log(`Update .env.local with: SWITCHBOARD_FEED_ADDRESS=${feedAddress}`);
  })
  .catch(console.error);