import { FC, useState, useCallback } from "react";
import {
  Modal,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
  Box,
  TableCell,
  TableRow,
  TableFooter,
  TablePagination,
  useTheme,
  IconButton,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  InstantSearch,
  SearchBox,
  useInstantSearch,
  useHits,
} from "react-instantsearch-hooks-web";
import algoliasearch from "algoliasearch";
import moment from "moment";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
    </Box>
  );
}

function CustomHits(props: any) {
  const { hits } = useHits(props);
  const { publicKey } = useWallet();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [modalOpen, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [selectedRow, setSelectedRow] = useState({
    id: "",
    type: "",
    time: "",
    from: "",
    to: "",
    amount: 0,
  });

  const rows = hits.filter((row) => row.from === publicKey?.toBase58());

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onRowClick = useCallback(
    async (row: any) => {
      setSelectedRow(row);
      setOpen(true);
    },
    [setSelectedRow]
  );

  return (
    <>
      <TableContainer component={Paper} sx={{ maxWidth: 900, maxHeight: 700 }}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ maxWidth: 150 }}>Transaction ID</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Time</TableCell>
              {/* <TableCell sx={{ maxWidth: 150 }}>From</TableCell> */}
              <TableCell sx={{ maxWidth: 150 }}>To</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row: any) => (
              <>
                <TableRow
                  onClick={() => onRowClick(row)}
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ maxWidth: 150 }}>
                    <Box
                      display="block"
                      width="140px"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {row.id}
                    </Box>
                  </TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">
                    {moment(row.time).fromNow()}
                  </TableCell>
                  {/* <TableCell align="right">
                    <Box
                      display="block"
                      width="140px"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {row.from}
                    </Box>
                  </TableCell> */}
                  <TableCell align="right">
                    <Box
                      display="block"
                      width="140px"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {row.to}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    {row.amount / 1_000_000_000} Sol
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
                    width="1100px"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Box width="70%" pb={3}>
                      Transaction ID: {selectedRow?.id}
                    </Box>
                    <Box width="70%" pb={3}>
                      Type: {selectedRow.type}
                    </Box>
                    <Box width="70%" pb={3}>
                      Time: {selectedRow.time}
                    </Box>
                    <Box width="70%" pb={3}>
                      From: {selectedRow.from}
                    </Box>
                    <Box width="70%" pb={3}>
                      To: {selectedRow.to}
                    </Box>
                    <Box width="70%">
                      Amount: {selectedRow.amount / 1_000_000_000} Sol
                    </Box>
                  </Box>
                </Modal>
              </>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

interface EQBProps {
  children: any;
  fallback: any;
}

function EmptyQueryBoundary({ children, fallback }: EQBProps) {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return fallback;
  }

  return children;
}

export const TransactionsView: FC = () => {
  const searchClient = algoliasearch(
    "BEOT1RHMQ5",
    "5091d66ccb7c437f4f4eec59f4b8b9ca"
  );

  // useEffect(() => {
  //   if (rows.length <= 0) {
  //     getTransactionsFromAPI(publicKey?.toBase58() ?? "").then((data: any) => {
  //       setRows(
  //         data?.transactions?.rows
  //           ?.map((transaction: any) => {
  //             return {
  //               id: transaction.id,
  //               type: transaction.type,
  //               time: transaction.timestamp,
  //               from: transaction.from_acc,
  //               to: transaction.to_acc,
  //               amount: transaction.amount,
  //             };
  //           })
  //           .reverse() ?? []
  //       );
  //     });
  //   }
  // }, [rows, publicKey, setRows]);

  // function Hit(hit: any) {
  //   console.log(hit);
  //   return (
  //     <Box p={1} className="result">
  //       <p>ID: {hit.hit.id}</p>
  //       <p>From: {hit.hit.from}</p>
  //       <p>To: {hit.hit.to}</p>
  //       <p>Amount: {hit.hit.amount / 1_000_000_000} Sol</p>
  //     </Box>
  //   );
  // }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        zIndex={1}
        p={2}
        pt={0}
        width="100%"
        height="100%"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <InstantSearch
          searchClient={searchClient}
          indexName="solana_transactions"
        >
          <SearchBox />
          <Box p={1}>
            <EmptyQueryBoundary fallback={null}>
              <CustomHits />
            </EmptyQueryBoundary>
          </Box>
        </InstantSearch>
      </Box>
      {/* {rows.length <= 0 ? (
        <LoadingSpinner />
      ) : (
        !focused && (
          <TableContainer
            component={Paper}
            sx={{ maxWidth: 900, maxHeight: 700 }}
          >
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ maxWidth: 150 }}>Transaction ID</TableCell>
                  <TableCell align="right">Time</TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>From</TableCell>
                  <TableCell sx={{ maxWidth: 150 }}>To</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row: any) => (
                  <>
                    <TableRow
                      onClick={() => onRowClick(row)}
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ maxWidth: 150 }}
                      >
                        <Box
                          display="block"
                          width="140px"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.id}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {moment(row.time).fromNow()}
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          display="block"
                          width="140px"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.from}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          display="block"
                          width="140px"
                          sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {row.to}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {row.amount / 1_000_000_000} Sol
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
                        width="1100px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box width="70%" pb={3}>
                          Transaction ID: {selectedRow?.id}
                        </Box>
                        <Box width="70%" pb={3}>
                          Type: {selectedRow.type}
                        </Box>
                        <Box width="70%" pb={3}>
                          Time: {selectedRow.time}
                        </Box>
                        <Box width="70%" pb={3}>
                          From: {selectedRow.from}
                        </Box>
                        <Box width="70%" pb={3}>
                          To: {selectedRow.to}
                        </Box>
                        <Box width="70%">
                          Amount: {selectedRow.amount / 1_000_000_000} Sol
                        </Box>
                      </Box>
                    </Modal>
                  </>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 },
                    ]}
                    colSpan={3}
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )
      )}*/}
    </Box>
  );
};
