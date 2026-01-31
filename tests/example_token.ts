import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { expect } from "chai";

describe("example_token", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  it("Is initialized!", async () => {
    // Add your test here
    console.log("Your test goes here!");
  });

  it("Can mint tokens", async () => {
    // TODO: Implement mint test
  });

  it("Can transfer tokens", async () => {
    // TODO: Implement transfer test
  });

  it("Can burn tokens", async () => {
    // TODO: Implement burn test
  });
});
