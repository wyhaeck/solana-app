import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback } from "react";
// import { notify } from "../utils/notifications";
import {
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
  PublicKey,
} from "@solana/web3.js";
import { Box } from "@mui/material";
import { StyledButton } from "./StyledButton";
import { StyledTextField } from "./StyledTextField";
import useTransactionStore from "../stores/useTransactionStore";
import { isBase58 } from "../utils/utils";

export const SendTransaction: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { address, sol, setAddress, setSol } = useTransactionStore(
    (state) => state
  );
  console.log(address, sol, setAddress, setSol);

  console.log(publicKey);

  const onClick = useCallback(async () => {
    if (!publicKey) {
      // notify({ type: "error", message: `Wallet not connected!` });
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }

    const pubKey = new PublicKey(address);
    let signature: TransactionSignature = "";
    try {
      const destAddress = Keypair.generate().publicKey;
      console.log(destAddress);
      // anything below this will fail, as this would be below the rent-exemption rate.
      const amount = sol * 1_000_000_000;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: pubKey,
          lamports: amount,
        })
      );

      signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "confirmed");

      // notify({
      //   type: "success",
      //   message: "Transaction successful!",
      //   txid: signature,
      // });
    } catch (error: any) {
      // notify({
      //   type: "error",
      //   message: `Transaction failed!`,
      //   description: error?.message,
      //   txid: signature,
      // });
      console.log("error", `Transaction failed! ${error?.message}`, signature);
      return;
    }
  }, [address, sol, publicKey, connection, sendTransaction]);

  const handleAddress = (event: any) => {
    setAddress(event.target.value);
  };

  const handleSol = (event: any) => {
    setSol(event.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <StyledTextField
        value={address}
        onChange={handleAddress}
        variant="outlined"
        label="Enter Account Address to send Solana to!"
        InputLabelProps={{
          sx: {
            fontFamily:
              "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            color: "white",
            "&.Mui-focused": { color: "white" },
          },
        }}
        fullWidth
      />
      <StyledTextField
        value={sol}
        onChange={handleSol}
        variant="outlined"
        label="Enter amount of Sol to send!"
        InputLabelProps={{
          sx: {
            fontFamily:
              "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
            color: "white",
            "&.Mui-focused": { color: "white" },
          },
        }}
        fullWidth
      />
      <StyledButton
        variant="contained"
        onClick={onClick}
        disabled={!publicKey || !isBase58(address)}
      >
        <div>Send Transaction</div>
      </StyledButton>
    </Box>
  );
};
