import { FC, useState, useEffect, useCallback } from "react";
import {
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { getTransactionsFromAPI } from "../../components/api/apiUtils";
import { stringify } from "querystring";
import LoadingSpinner from "../../components/loading/LoadingSpinner";

interface transactionData {
  id: string;
  type: string;
  time: number;
  from: string;
  to: string;
  amount: number;
}

export const TransactionsView: FC = ({}) => {
  const [modalOpen, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [rows, setRows] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState(rows[0] ?? {});
  const onRowClick = useCallback(
    async (row: any) => {
      setSelectedRow(row);
      setOpen(true);
    },
    [setSelectedRow]
  );

  useEffect(() => {
    if (rows.length <= 0) {
      getTransactionsFromAPI().then((data) => {
        setRows(
          data?.transactions?.rows?.map((transaction: any) => {
            return {
              id: transaction.id,
              type: transaction.type,
              time: transaction.timestamp,
              from: transaction.from_acc,
              to: transaction.to_acc,
              amount: transaction.amount,
            };
          })
        );
      });
    }
  }, [rows, setRows]);

  return (
    <div>
      <div>
        {rows.length <= 0 ? (
          <LoadingSpinner />
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Time</TableCell>
                  <TableCell align="right">From</TableCell>
                  <TableCell align="right">To</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <>
                    <TableRow
                      onClick={() => onRowClick(row)}
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.type}</TableCell>
                      <TableCell align="right">{row.time}</TableCell>
                      <TableCell align="right">{row.from}</TableCell>
                      <TableCell align="right">{row.to}</TableCell>
                      <TableCell align="right">
                        {row.amount / 1_000_000_000}
                      </TableCell>
                    </TableRow>

                    <Modal
                      open={modalOpen}
                      onClose={handleClose}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Box
                        style={{
                          backgroundColor: "#6e53e6", // "#707070",
                          // backgroundImage:
                          //   "linear-gradient(45deg, #8776d4, #6e53e6)",
                          borderRadius: "25px",
                          color: "white",
                        }}
                        height="400px"
                        width="600px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box width="65%" pb={3}>
                          Transaction ID: {selectedRow?.id}
                        </Box>
                        <Box width="65%" pb={3}>
                          Type: {selectedRow.type}
                        </Box>
                        <Box width="65%" pb={3}>
                          Time: {selectedRow.time}
                        </Box>
                        <Box width="65%" pb={3}>
                          From: {selectedRow.from}
                        </Box>
                        <Box width="65%" pb={3}>
                          To: {selectedRow.to}
                        </Box>
                        <Box width="65%">
                          Amount: {selectedRow.amount / 1_000_000_000} Sol
                        </Box>
                      </Box>
                    </Modal>
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};
