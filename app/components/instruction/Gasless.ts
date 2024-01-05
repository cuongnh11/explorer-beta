import {TransactionInstruction} from "@solana/web3.js";

export const GASLESS_PROGRAM_ID = "GasP6kcNpTdXA1M7ENyh5kCEvtHPgy71Habxe62gqHqH";

export const isGaslessTransactionInstruction = (
    instruction: TransactionInstruction
) => {
    return instruction.programId.toBase58() === GASLESS_PROGRAM_ID;
};
