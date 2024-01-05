import {TransactionInstruction} from "@solana/web3.js";

export const NEMO_SWAP_PROGRAM_ID = "7rh7ZtPzHqdY82RWjHf1Q8NaQiWnyNqkC48vSixcBvad";

export const isNemoSwapInstruction = (
    instruction: TransactionInstruction
) => {
    return instruction.programId.toBase58() === NEMO_SWAP_PROGRAM_ID;
};
