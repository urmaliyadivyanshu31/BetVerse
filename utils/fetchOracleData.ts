import { Connection, PublicKey } from '@solana/web3.js'
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor'
import idl from './idl.json'

const PROGRAM_ID = new PublicKey('BkEGzSgjk1HyiDfbGFzUYyXAx5gH8wAP2G41dRykRHyL')
const AGGREGATOR_ACCOUNT = new PublicKey('EYiAmGSdsQTuCw413V5BzaruWuCCSDgTPtBGvLkXHbe7')
const NETWORK = 'https://api.devnet.solana.com'

export async function fetchOracleData() {
  const connection = new Connection(NETWORK)
  const provider = new AnchorProvider(connection, {} as any, {})
const program = new Program(idl as unknown as Idl, PROGRAM_ID, provider);
    const accountInfo = await connection.getAccountInfo(AGGREGATOR_ACCOUNT)
  const account = await program.account.aggregatorAccountData.fetch(AGGREGATOR_ACCOUNT)
  const value = account.latestConfirmedResult[0].toNumber()
  return { value }
}
