import { FC } from "react";
import { SendTransaction } from "../../components/buttons/SendTransaction";

export const BasicsView: FC = ({}) => {
  return (
    <div>
      <div>
        <h1>Basics</h1>
        {/* CONTENT GOES HERE */}
        <div>
          <SendTransaction />
        </div>
      </div>
    </div>
  );
};
