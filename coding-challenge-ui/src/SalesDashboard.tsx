import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
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

interface sale {
  storeId: string,
  marketplace: string,
  country: string,
  shopName: string,
  Id: string,
  orderId: string,
  latest_ship_date: string,
  shipment_status: string,
  destination: string,
  items: string,
  orderValue: string
}


function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

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

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
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
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function getOverdueDayes(lastShipDate: string) {
  const todayMomemnt = moment();
  const lastShipDateMoment = moment(lastShipDate, "DD/MM/YYYY");
  const duration = moment.duration(todayMomemnt.diff(lastShipDateMoment));
  const dayesOverDue = Math.ceil(duration.asDays());
  return dayesOverDue;
}

const MarketplaceComponent = ({ countryCode, marketplace }: { countryCode: string, marketplace: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignContent: "center",
        justifyContent: "flex-start",
      }}
    >
      <img
        src={`https://countryflagsapi.com/png/${countryCode}`}
        width={30}
        style={{ marginRight: "10px" }}
        alt="flag"
      />
      {marketplace}
    </Box>
  );
};

export default function SalesTable({ salesData }: any) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [pendingSales, setPendingSales] = React.useState([]);
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');

  React.useEffect(() => {
    setPendingSales(
      salesData.filter((sale: any) => sale.shipment_status === "Pending").sort(function(a:sale, b:sale) {
        const shippingDateA = moment(a.latest_ship_date, "DD/MM/YYYY");
        const shippingDateB = moment(b.latest_ship_date, "DD/MM/YYYY");
        const timeDiff = shippingDateA.diff(shippingDateB);
        return order === "asc" ? timeDiff: -timeDiff
      }
    ));
  }, [salesData, order]);


  const columns = [
    "MARKETPLACE",
    "STORE",
    "ORDER ID",
    "ORDER VALUE",
    "ITEMS",
    "DESTINATION",
  ];

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - pendingSales.length) : 0;

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

  const changeOrder = () => { 
    setOrder(order === "asc" ? "desc":"asc")
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" p={"1rem"} gutterBottom>
        Overdue Orders
      </Typography>
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                align={column === "ORDER VALUE" ? "right" : "left"}
                key={column}
                sx={{ fontWeight: "bold", bgcolor: "whitesmoke" }}
              >
                {column}
              </TableCell>
            ))}
            <TableCell
              align={"center"}
              sx={{ fontWeight: "bold", bgcolor: "whitesmoke" }}
              sortDirection={order}
            >
              {"DAYES OVERDUE"}
              <TableSortLabel
                active={true}
                direction={order}
                onClick={()=>changeOrder()}
              >
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? pendingSales.slice(
              page * rowsPerPage,
              page * rowsPerPage + rowsPerPage
            )
            : pendingSales
          ).map((row: sale) => (
            <TableRow key={row.Id}>
              <TableCell component="th" scope="row" sx={{ fontWeight: "bold" }}>
                <MarketplaceComponent
                  countryCode={row.country}
                  marketplace={row.marketplace}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{row.shopName}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{row.orderId}</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {row.orderValue}
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>{row.items}</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                {row.destination}
              </TableCell>
              <TableCell sx={{ color: "red", fontWeight: "bold" }} align="center">
                {getOverdueDayes(row.latest_ship_date)}
              </TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={7}
              count={pendingSales.length}
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
  );
}
