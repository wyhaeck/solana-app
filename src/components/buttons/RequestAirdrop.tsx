import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, TransactionSignature } from "@solana/web3.js";
import { FC, useCallback } from "react";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import { Box } from "@mui/material";
import { StyledButton } from "../styled/StyledButton";
import { toast } from "react-toastify";

export const RequestAirdrop: FC = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const getUserSOLBalance = useUserSOLBalanceStore(
    (state) => state.getUserSOLBalance
  );

  const onClick = useCallback(async () => {
    if (!publicKey) {
      console.log("error", "Wallet not connected!");
      // notification
      toast.error("Wallet not connected!", {
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    let signature: TransactionSignature = "";

    try {
      signature = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature, "confirmed");
      toast.success(`Transaction done! ${signature}`, {
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      getUserSOLBalance(publicKey, connection);
    } catch (error: any) {
      toast.error(`Error: Airdrop Failed! ${error?.message} ${signature}`, {
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
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
