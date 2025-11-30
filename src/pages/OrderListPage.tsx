import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Pagination,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Visibility as ViewIcon, Edit as EditIcon } from "@mui/icons-material";
import type {
  Order,
  OrderFilter,
  OrderListResponse,
  OrderSortField,
  OrderStatus,
  Payment,
} from "../domains/order/types";
import { listOrders } from "../domains/order/order-api";

function OrderListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [meta, setMeta] = useState<OrderListResponse["meta"] | null>(null);
  const [po, setPo] = useState("");
  const [buyerId, setBuyerId] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "">("");
  const [payment, setPayment] = useState<Payment | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<OrderSortField>("orderDate");
  const [mode, setMode] = useState<"and" | "or">("and");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const filter: OrderFilter = {
        sortOrder,
        sortField,
        mode,
        page,
        pageSize,
      };
      if (po.trim()) filter.po = po;
      if (buyerId.trim()) filter.buyerId = Number(buyerId);
      if (recipientId.trim()) filter.recipientId = Number(recipientId);
      if (orderStatus) filter.orderStatus = orderStatus;
      if (payment) filter.payment = payment;
      const json = await listOrders(filter);
      setOrders(json.data);
      setMeta(json.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [
    sortOrder,
    sortField,
    mode,
    page,
    pageSize,
    po,
    buyerId,
    recipientId,
    orderStatus,
    payment,
  ]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders, page]);

  const applyFilters = () => {
    setPage(1);
    void fetchOrders();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h3" component="h1">
          Order List
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            void navigate("/orders/create");
          }}
        >
          Create New Order
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Stack direction="row" flexWrap="wrap" sx={{ gap: 2 }}>
              <TextField
                label="PO Number"
                value={po}
                onChange={(e) => setPo(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Buyer ID"
                type="number"
                value={buyerId}
                onChange={(e) => setBuyerId(e.target.value)}
                sx={{ minWidth: 150 }}
              />
              <TextField
                label="Recipient ID"
                type="number"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                sx={{ minWidth: 150 }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={orderStatus}
                  label="Order Status"
                  onChange={(e) =>
                    setOrderStatus(e.target.value as typeof orderStatus)
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Downpayment">Downpayment</MenuItem>
                  <MenuItem value="Belum bayar">Belum bayar</MenuItem>
                  <MenuItem value="Lunas">Lunas</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Payment</InputLabel>
                <Select
                  value={payment}
                  label="Payment"
                  onChange={(e) => setPayment(e.target.value as typeof payment)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Tunai">Tunai</MenuItem>
                  <MenuItem value="Kartu Kredit">Kartu Kredit</MenuItem>
                  <MenuItem value="Transfer Bank">Transfer Bank</MenuItem>
                  <MenuItem value="QRIS">QRIS</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Sort Field</InputLabel>
                <Select
                  value={sortField}
                  label="Sort Field"
                  onChange={(e) =>
                    setSortField(e.target.value as OrderSortField)
                  }
                >
                  <MenuItem value="po">PO</MenuItem>
                  <MenuItem value="orderDate">Order Date</MenuItem>
                  <MenuItem value="deliveryDate">Delivery Date</MenuItem>
                  <MenuItem value="totalPurchase">Total Purchase</MenuItem>
                  <MenuItem value="grandTotal">Grand Total</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortOrder}
                  label="Order"
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="asc">Ascending</MenuItem>
                  <MenuItem value="desc">Descending</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>Mode</InputLabel>
                <Select
                  value={mode}
                  label="Mode"
                  onChange={(e) => setMode(e.target.value)}
                >
                  <MenuItem value="and">AND</MenuItem>
                  <MenuItem value="or">OR</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Page Size"
                type="number"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                slotProps={{ htmlInput: { min: 1 } }}
                sx={{ minWidth: 120 }}
              />
              <Button
                variant="contained"
                onClick={applyFilters}
                sx={{ height: 56 }}
              >
                Apply
              </Button>
            </Stack>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>PO</TableCell>
                  <TableCell>Buyer ID</TableCell>
                  <TableCell>Recipient ID</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Delivery Date</TableCell>
                  <TableCell align="right">Grand Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.orderId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.po}</TableCell>
                    <TableCell>{order.buyerId}</TableCell>
                    <TableCell>{order.recipientId}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{formatDate(order.deliveryDate)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(order.grandTotal)}
                    </TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {
                            void navigate(`/orders/${order.orderId}`);
                          }}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Order">
                        <IconButton
                          size="small"
                          onClick={() => {
                            void navigate(`/orders/${order.orderId}/edit`);
                          }}
                          color="secondary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {meta && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Stack spacing={2} alignItems="center">
                <Pagination
                  count={meta.totalPages}
                  page={meta.page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
                <Typography variant="body2" color="text.secondary">
                  Page {meta.page} of {meta.totalPages}
                </Typography>
              </Stack>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}

export default OrderListPage;
