import { useCallback } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "../views/home";
import { Box } from "@mui/material";
import { StyledButton } from "../components/styled/StyledButton";
import useBasicsStore from "../stores/useBasicsStore";
import { TransactionsView } from "../views";

const Home: NextPage = (props) => {
  const { homeView, setView } = useBasicsStore((state) => state);

  const handleClick = useCallback(
    async (view: boolean) => {
      setView(view);
    },
    [setView]
  );

  return (
    <div>
      <Head>
        <title>Solana Transactions</title>
        <meta name="description" content="Solana Scaffold" />
      </Head>
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
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              alignItems="center"
              pt={1}
            >
              <Box p={1}>
                <StyledButton
                  variant="contained"
                  onClick={() => handleClick(true)}
                >
                  Transfer
                </StyledButton>
              </Box>
              <Box p={1}>
                <StyledButton
                  variant="contained"
                  onClick={() => handleClick(false)}
                >
                  Transactions
                </StyledButton>
              </Box>
            </Box>
            <h1 className="gradient">Solana Transfer App</h1>
            {homeView ? <HomeView /> : <TransactionsView />}
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
