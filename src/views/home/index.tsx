import { FC, useEffect } from "react";
import { Box } from "@mui/material";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { RequestAirdrop } from "../../components/buttons/RequestAirdrop";
import { SendTransaction } from "../../components/buttons/SendTransaction";
import { StyledTextField } from "../../components/styled/StyledTextField";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { balance, getUserSOLBalance } = useUserSOLBalanceStore(
    (state) => state
  );
  // const getUserSOLBalance = useUserSOLBalanceStore.getState().getUserSOLBalance;

  useEffect(() => {
    if (wallet.publicKey) {
      console.log(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [wallet.publicKey, connection, getUserSOLBalance]);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        width="60%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        className="filledBox"
        pb={2}
      >
        <Box
          width="80%"
          height="50%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          className="filledBox"
        >
          <h1 className="gradient">Solana Transfer App</h1>
          <Box p={2}>
            <WalletMultiButtonDynamic />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
          >
            <RequestAirdrop />
            {wallet.publicKey && (
              <Box
                p={2}
                display="flex"
                flexDirection="column"
                alignItems="center"
                width="100%"
              >
                <Box>
                  <h3>Your Public Key:</h3>
                </Box>
                <StyledTextField
                  defaultValue={wallet.publicKey.toBase58()}
                  fullWidth
                  sx={{
                    "& input": {
                      textAlign: "center",
                    },
                  }}
                  InputProps={{
                    readOnly: true,
                    style: {
                      borderRadius: "8px",
                      textAlign: "center",
                    },
                  }}
                />
              </Box>
            )}
            {wallet && (
              <h3>Your SOL Balance: {(balance || 0).toLocaleString()}</h3>
            )}
            <SendTransaction />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
