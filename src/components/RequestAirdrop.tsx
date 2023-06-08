import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js";
import { FC, useCallback } from "react";
import { notify } from "../utils/notifications";
import useUserSOLBalanceStore from "../stores/useUserSOLBalanceStore";
import { Box } from "@mui/material";
import { StyledButton } from "./StyledButton";

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const getUserSOLBalance = useUserSOLBalanceStore(
    (state) => state.getUserSOLBalance
  ); // .getState().getUserSOLBalance;

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log("error", "Wallet not connected!");
      notify({
        type: "error",
        message: "error",
        description: "Wallet not connected!",
      });
      return;
    }

    let signature: TransactionSignature = "";

    try {
      signature = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      );
      console.log(await connection);
      await connection.confirmTransaction(signature, "confirmed");
      notify({
        type: "success",
        message: "Airdrop successful!",
        txid: signature,
      });
      getUserSOLBalance(publicKey, connection);
    } catch (error: any) {
      notify({
        type: "error",
        message: `Airdrop failed!`,
        description: error?.message,
        txid: signature,
      });
      console.log("error", `Airdrop failed! ${error?.message}`, signature);
    }
  }, [publicKey, connection, getUserSOLBalance]);

  return (
    <Box display="flex" justifyContent="center">
      <StyledButton variant="contained" onClick={onClick}>
        <div>Airdrop 1</div>
      </StyledButton>
    </Box>
  );
};
