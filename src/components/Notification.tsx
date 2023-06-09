import { toast } from "react-toastify";
import { getExplorerUrl } from "../utils/utils";
import Link from "next/link";

const TransactionLink = (message: string, signature: string) => (
  <div>
    <Link href={getExplorerUrl(signature)} target="_blank">
      {message}
    </Link>
  </div>
);

export const Notification = (
  message: string,
  error: boolean,
  airdrop: boolean = false,
  signature: string = ""
) => {
  return error
    ? toast.error(message, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    : airdrop
    ? toast.success(message, {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      })
    : toast.success(TransactionLink(message, signature), {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
};
