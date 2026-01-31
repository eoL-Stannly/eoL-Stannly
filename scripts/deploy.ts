import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// This script deploys and initializes the example token program

async function main() {
  // Configure the client
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  console.log("Deploying with wallet:", provider.wallet.publicKey.toString());

  const balance = await provider.connection.getBalance(provider.wallet.publicKey);
  console.log("Wallet balance:", balance / 1e9, "SOL");

  // Load the program IDL and create program interface
  // Note: You need to build the program first with `anchor build`
  // Then run this script with `anchor run deploy`

  console.log("\nTo deploy your Anchor program:");
  console.log("1. Run: anchor build");
  console.log("2. Run: anchor deploy");
  console.log("3. Update the program ID in Anchor.toml and lib.rs");
  console.log("\nFor local development:");
  console.log("1. Run: solana-test-validator");
  console.log("2. Run: anchor build");
  console.log("3. Run: anchor deploy --provider.cluster localnet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
