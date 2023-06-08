import { FC } from "react";
import Head from "next/head";
import { AppProps } from "next/dist/shared/lib/router/router";
import WalletContextProvider from "../contexts/WalletContextProvider";
//  import NotificationList from "../components/Notification";
import { ToastContainer } from "react-toastify";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Transfer</title>
      </Head>

      <WalletContextProvider>
        <div className="flex flex-col h-screen">
          {/* <NotificationList /> */}
          <ToastContainer />
          {/* <AppBar /> */}
          <Component {...pageProps} />
        </div>
      </WalletContextProvider>
    </>
  );
};

export default App;
