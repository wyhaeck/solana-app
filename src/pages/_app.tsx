import { FC } from "react";
import Head from "next/head";
import { AppProps } from "next/dist/shared/lib/router/router";
import WalletContextProvider from "../contexts/WalletContextProvider";
//  import NotificationList from "../components/Notification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css");

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Transfer</title>
      </Head>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <WalletContextProvider>
        <div className="flex flex-col h-screen">
          <Component {...pageProps} />
        </div>
      </WalletContextProvider>
    </>
  );
};

export default App;
