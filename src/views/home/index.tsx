import { FC, useEffect } from "react";
import { Box } from "@mui/material";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";
import { RequestAirdrop } from "../../components/RequestAirdrop";
import { SendTransaction } from "../../components/SendTransaction";
import useUserSOLBalanceStore from "../../stores/useUserSOLBalanceStore";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const HomeView: FC = ({}) => {
  const wallet = useWallet();
  const { connection } = useConnection();
  const balance = useUserSOLBalanceStore((state) => state.balance);
  const getUserSOLBalance = useUserSOLBalanceStore.getState().getUserSOLBalance;

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
        width="50%"
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
          <Box>
            <RequestAirdrop />
            {wallet.publicKey && (
              <p>Public Key: {wallet.publicKey.toBase58()}</p>
            )}
            {wallet && <p>SOL Balance: {(balance || 0).toLocaleString()}</p>}
            <SendTransaction />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
