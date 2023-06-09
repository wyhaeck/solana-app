import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback } from "react";
import {
  SystemProgram,
  Transaction,
  TransactionSignature,
  PublicKey,
} from "@solana/web3.js";
import { Box } from "@mui/material";
import { StyledButton } from "../styled/StyledButton";
import { StyledTextField } from "../styled/StyledTextField";
import useTransactionStore from "../../stores/useTransactionStore";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import useBasicsStore from "../../stores/useBasicsStore";
import { isBase58 } from "../../utils/utils";
import LoadingSpinner from "../loading/LoadingSpinner";
import { Notification } from "../Notification";
import { TransactionType } from "../../types/TransactionType";
import moment from "moment";

function sendTransactionToAPI(transaction: TransactionType) {
  const transactionData = async () => {
    const data = {
      id: transaction.id,
      type: transaction.type,
      timestamp: transaction.timestamp,
      from_acc: transaction.from_acc,
      to_acc: transaction.to_acc,
      amount: transaction.amount,
    };

    const response = await fetch("/api/database", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  };
  transactionData();
}

// const sendTransactionToDatabase = async (
//   request: NextApiRequest,
//   response: NextApiResponse,
//   transaction: TransactionType
// ) => {
//   const client = await db.connect();

//   try {
//     await client.sql`INSERT INTO transactions (id, type, timestamp, from_acc, to_acc, amount) VALUES (${transaction.id}, ${transaction.type}, ${transaction.timestamp}, ${transaction.from_acc}, ${transaction.to_acc}, ${transaction.amount});`;
//   } catch (error) {
//     return response.status(500).json({ error });
//   }
// };

export const SendTransaction: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { address, sol, setTransactionAddress, setTransactionSol } =
    useTransactionStore((state) => state);
  const { balance } = useUserSOLBalanceStore((state) => state);
  const { loading, setLoading } = useBasicsStore((state) => state);

  const onClick = useCallback(async () => {
    if (!publicKey) {
      // notification
      Notification(`Send Transaction: Wallet not connected!`, true, false);
      console.log("error", `Send Transaction: Wallet not connected!`);
      return;
    }
    try {
      const destKey = new PublicKey(address);
      const isSolana = PublicKey.isOnCurve(destKey.toBuffer());
      if (!isSolana) {
        // notification
        Notification(
          `Send Transaction: This address is not a valid address!`,
          true,
          false
        );
        return;
      }
    } catch (error: any) {
      // notification
      Notification(`Send Transaction: ${error?.message}`, true, false);
      return;
    }
    let signature: TransactionSignature = "";
    setLoading(true);
    try {
      const destKey = new PublicKey(address);
      // anything below this will fail, as this would be below the rent-exemption rate.
      const amount = sol * 1_000_000_000;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: destKey,
          lamports: amount,
        })
      );

      signature = await sendTransaction(transaction, connection);

      await connection.confirmTransaction(signature, "confirmed");
      Notification(
        `Transaction sent! Transaction: ${signature}`,
        false,
        false,
        signature
      );
      sendTransactionToAPI({
        id: signature,
        type: "Spl-Transfer",
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        from_acc: publicKey.toBase58(),
        to_acc: address,
        amount: amount,
      });
      setLoading(false);

      // notification
    } catch (error: any) {
      // notification

      console.log("error", `Transaction failed! ${error?.message}`, signature);
      setLoading(false);
      return;
    }
  }, [address, sol, publicKey, connection, sendTransaction, setLoading]);

  const handleAddress = (event: any) => {
    setTransactionAddress(event.target.value);
  };

  const handleSol = (event: any) => {
    setTransactionSol(event.target.value);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width="100%"
        >
          <Box p={2} pb={1} width="100%">
            <StyledTextField
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
              value={address}
              onChange={handleAddress}
              variant="outlined"
              label="Enter Account Address to send Solana to!"
              InputLabelProps={{
                sx: {
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                  color: "white",
                  "&.Mui-focused": { color: "white", borderColor: "white" },
                  fieldset: { borderColor: "white" },
                },
              }}
              fullWidth
            />
          </Box>
          <Box
            p={2}
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <StyledTextField
              InputProps={{
                style: {
                  borderRadius: "8px",
                },
              }}
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
            />
          </Box>
          <StyledButton
            variant="contained"
            onClick={onClick}
            disabled={!publicKey || !isBase58(address)}
          >
            <div>Send Transaction</div>
          </StyledButton>
        </Box>
      )}
    </>
  );
};