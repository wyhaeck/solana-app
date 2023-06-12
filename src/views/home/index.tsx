import { FC, useEffect } from "react";
import { Box } from "@mui/material";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { RequestAirdrop } from "../../components/buttons/RequestAirdrop";
import { SendTransaction } from "../../components/buttons/SendTransaction";
import { StyledTextField } from "../../components/styled/StyledTextField";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const HomeView: FC = () => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { address, balance, getUserSOLBalance, setAddress } =
    useUserSOLBalanceStore((state) => state);

  useEffect(() => {
    if (wallet.publicKey) {
      setAddress(wallet.publicKey.toBase58());
      getUserSOLBalance(wallet.publicKey, connection);
    }
  }, [address, wallet.publicKey, connection, getUserSOLBalance, setAddress]);

  return (
    <>
      <Box p={2}>
        <WalletMultiButtonDynamic />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
      >
        {wallet.publicKey && (
          <>
            <RequestAirdrop />
            {address === wallet?.publicKey?.toBase58() ? (
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
                  defaultValue={address}
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
            ) : (
              <LoadingSpinner />
            )}
            {wallet && (
              <h3>Your SOL Balance: {(balance || 0).toLocaleString()}</h3>
            )}
            <SendTransaction />
          </>
        )}
      </Box>
    </>
  );
};
