import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  Typography,
  Paper,
  Stack,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from "@mui/material";
import { getOrder } from "../domains/order/order-api";
import type { Order } from "../domains/order/types";

function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) {
        setError("Invalid order ID");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getOrder(Number(id));
        if (response.success) {
          setOrder(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Order not found"}</Alert>
        <Button
          variant="outlined"
          onClick={() => {
            void navigate("/orders");
          }}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h3" component="h1">
          Order Details
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => {
              void navigate("/orders");
            }}
          >
            Back to List
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void navigate(`/orders/${id}/edit`);
            }}
          >
            Edit Order
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Order Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack spacing={3}>
          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Order ID
              </Typography>
              <Typography variant="h6">{order.orderId}</Typography>
            </Stack>

            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                PO Number
              </Typography>
              <Typography variant="h6">{order.po}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Buyer ID
              </Typography>
              <Typography variant="body1">{order.buyerId}</Typography>
            </Stack>

            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Recipient ID
              </Typography>
              <Typography variant="body1">{order.recipientId}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1">
                {formatDate(order.orderDate)}
              </Typography>
            </Stack>

            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Delivery Date
              </Typography>
              <Typography variant="body1">
                {formatDate(order.deliveryDate)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Pickup/Delivery
              </Typography>
              <Typography variant="body1">{order.pickupDelivery}</Typography>
            </Stack>

            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Payment Method
              </Typography>
              <Typography variant="body1">{order.payment}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Order Status
              </Typography>
              <Typography variant="body1">{order.orderStatus}</Typography>
            </Stack>

            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Shipping Cost
              </Typography>
              <Typography variant="body1">
                {formatCurrency(order.shippingCost)}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Total Purchase
              </Typography>
              <Typography variant="h6">
                {formatCurrency(order.totalPurchase)}
              </Typography>
            </Stack>

            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Grand Total
              </Typography>
              <Typography variant="h6" color="primary">
                {formatCurrency(order.grandTotal)}
              </Typography>
            </Stack>
          </Stack>

          {order.note && (
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary">
                Note
              </Typography>
              <Typography variant="body1">{order.note}</Typography>
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Order Items
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item ID</TableCell>
                <TableCell>Item Name</TableCell>
                <TableCell align="right">Item Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Subtotal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.orderItems.map((item) => (
                <TableRow
                  key={`order-item-${item.itemId}-${crypto.randomUUID()}`}
                >
                  <TableCell>{item.itemId}</TableCell>
                  <TableCell>{item.itemName}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.itemPrice)}
                  </TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(item.itemPrice * item.quantity)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Timestamps
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Stack direction="row" spacing={3}>
          <Stack spacing={1} flex={1}>
            <Typography variant="overline" color="text.secondary">
              Created At
            </Typography>
            <Typography variant="body1">
              {formatDate(order.createdAt)}
            </Typography>
          </Stack>

          <Stack spacing={1} flex={1}>
            <Typography variant="overline" color="text.secondary">
              Updated At
            </Typography>
            <Typography variant="body1">
              {formatDate(order.updatedAt)}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default OrderDetailPage;
