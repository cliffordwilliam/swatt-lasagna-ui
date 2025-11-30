import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
  Box,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  OrderUpdateSchema,
  type OrderUpdateFormData,
} from "../domains/order/validation";
import { getOrder, updateOrder } from "../domains/order/order-api";
import type {
  PickupDelivery,
  Payment,
  OrderStatus,
  PersonUpsert,
  OrderItemRequest,
} from "../domains/order/types";

function OrderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OrderUpdateFormData>({
    po: "",
    buyer: {
      personName: "",
    },
    recipient: {
      personName: "",
    },
    orderDate: "",
    deliveryDate: "",
    pickupDelivery: "Pickup",
    shippingCost: 0,
    payment: "Tunai",
    orderStatus: "Belum bayar",
    note: "",
    items: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) {
        setApiError("Invalid order ID");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getOrder(Number(id));
        if (response.success) {
          const order = response.data;
          setFormData({
            po: order.po,
            buyer: {
              personId: order.buyerId,
              personName: "", // We don't have person name in the response
            },
            recipient: {
              personId: order.recipientId,
              personName: "", // We don't have person name in the response
            },
            orderDate: order.orderDate.split("T")[0],
            deliveryDate: order.deliveryDate.split("T")[0],
            pickupDelivery: order.pickupDelivery,
            shippingCost: order.shippingCost,
            payment: order.payment,
            orderStatus: order.orderStatus,
            note: order.note || "",
            items: order.orderItems.map((item) => ({
              itemId: item.itemId,
              quantity: item.quantity,
              itemName: item.itemName,
              itemPrice: item.itemPrice,
            })),
          });
        }
      } catch (err) {
        setApiError(
          err instanceof Error ? err.message : "Failed to load order",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void fetchOrder();
  }, [id]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePersonChange = (
    personType: "buyer" | "recipient",
    field: keyof PersonUpsert,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [personType]: {
        ...prev[personType],
        [field]: value,
      },
    }));
  };

  const handlePersonPhoneChange = (
    personType: "buyer" | "recipient",
    field: "phoneNumber" | "preferred",
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [personType]: {
        ...prev[personType],
        phone: {
          phoneNumber: prev[personType]?.phone?.phoneNumber || "",
          preferred: prev[personType]?.phone?.preferred || false,
          [field]: value,
        },
      },
    }));
  };

  const handlePersonAddressChange = (
    personType: "buyer" | "recipient",
    field: "address" | "preferred",
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [personType]: {
        ...prev[personType],
        address: {
          address: prev[personType]?.address?.address || "",
          preferred: prev[personType]?.address?.preferred || false,
          [field]: value,
        },
      },
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItemRequest,
    value: unknown,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...(prev.items || []), { itemId: 0, quantity: 1 }],
    }));
  };

  const removeItem = (index: number) => {
    if ((formData.items?.length || 0) > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items?.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    if (!id) {
      setApiError("Invalid order ID");
      return;
    }

    const result = OrderUpdateSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const path = err.path.join(".");
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateOrder(Number(id), result.data);
      if (response.success) {
        void navigate(`/orders/${id}`);
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Failed to update order",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (apiError && !formData.po) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{apiError}</Alert>
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Edit Order
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Stack spacing={4}>
            {apiError && <Alert severity="error">{apiError}</Alert>}

            {/* Basic Order Info */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Order Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={3}>
                <TextField
                  label="PO Number"
                  value={formData.po}
                  onChange={(e) => handleChange("po", e.target.value)}
                  error={!!errors.po}
                  helperText={errors.po}
                  fullWidth
                />

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Order Date"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => handleChange("orderDate", e.target.value)}
                    error={!!errors.orderDate}
                    helperText={errors.orderDate}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />

                  <TextField
                    label="Delivery Date"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) =>
                      handleChange("deliveryDate", e.target.value)
                    }
                    error={!!errors.deliveryDate}
                    helperText={errors.deliveryDate}
                    fullWidth
                    slotProps={{ inputLabel: { shrink: true } }}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Pickup/Delivery</InputLabel>
                    <Select
                      value={formData.pickupDelivery}
                      label="Pickup/Delivery"
                      onChange={(e) =>
                        handleChange(
                          "pickupDelivery",
                          e.target.value as PickupDelivery,
                        )
                      }
                    >
                      <MenuItem value="Pickup">Pickup</MenuItem>
                      <MenuItem value="Delivery">Delivery</MenuItem>
                      <MenuItem value="Gojek">Gojek</MenuItem>
                      <MenuItem value="Citytran">Citytran</MenuItem>
                      <MenuItem value="Paxel">Paxel</MenuItem>
                      <MenuItem value="Daytrans">Daytrans</MenuItem>
                      <MenuItem value="Baraya">Baraya</MenuItem>
                      <MenuItem value="Lintas">Lintas</MenuItem>
                      <MenuItem value="Bineka">Bineka</MenuItem>
                      <MenuItem value="Jne">Jne</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    label="Shipping Cost"
                    type="number"
                    value={formData.shippingCost}
                    onChange={(e) =>
                      handleChange("shippingCost", e.target.value)
                    }
                    error={!!errors.shippingCost}
                    helperText={errors.shippingCost}
                    fullWidth
                    slotProps={{ htmlInput: { min: 0, max: 50_000_000 } }}
                  />
                </Stack>

                <Stack direction="row" spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>Payment Method</InputLabel>
                    <Select
                      value={formData.payment}
                      label="Payment Method"
                      onChange={(e) =>
                        handleChange("payment", e.target.value as Payment)
                      }
                    >
                      <MenuItem value="Tunai">Tunai</MenuItem>
                      <MenuItem value="Kartu Kredit">Kartu Kredit</MenuItem>
                      <MenuItem value="Transfer Bank">Transfer Bank</MenuItem>
                      <MenuItem value="QRIS">QRIS</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth>
                    <InputLabel>Order Status</InputLabel>
                    <Select
                      value={formData.orderStatus}
                      label="Order Status"
                      onChange={(e) =>
                        handleChange(
                          "orderStatus",
                          e.target.value as OrderStatus,
                        )
                      }
                    >
                      <MenuItem value="Downpayment">Downpayment</MenuItem>
                      <MenuItem value="Belum bayar">Belum bayar</MenuItem>
                      <MenuItem value="Lunas">Lunas</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>

                <TextField
                  label="Note"
                  value={formData.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  error={!!errors.note}
                  helperText={errors.note}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Stack>
            </Box>

            {/* Buyer Information */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Buyer Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <TextField
                  label="Buyer Name"
                  value={formData.buyer?.personName || ""}
                  onChange={(e) =>
                    handlePersonChange("buyer", "personName", e.target.value)
                  }
                  error={!!errors["buyer.personName"]}
                  helperText={errors["buyer.personName"]}
                  fullWidth
                />

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Phone Number (optional)"
                    value={formData.buyer?.phone?.phoneNumber || ""}
                    onChange={(e) =>
                      handlePersonPhoneChange(
                        "buyer",
                        "phoneNumber",
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.buyer?.phone?.preferred || false}
                        onChange={(e) =>
                          handlePersonPhoneChange(
                            "buyer",
                            "preferred",
                            e.target.checked,
                          )
                        }
                      />
                    }
                    label="Preferred"
                  />
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Address (optional)"
                    value={formData.buyer?.address?.address || ""}
                    onChange={(e) =>
                      handlePersonAddressChange(
                        "buyer",
                        "address",
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.buyer?.address?.preferred || false}
                        onChange={(e) =>
                          handlePersonAddressChange(
                            "buyer",
                            "preferred",
                            e.target.checked,
                          )
                        }
                      />
                    }
                    label="Preferred"
                  />
                </Stack>
              </Stack>
            </Box>

            {/* Recipient Information */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Recipient Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <TextField
                  label="Recipient Name"
                  value={formData.recipient?.personName || ""}
                  onChange={(e) =>
                    handlePersonChange(
                      "recipient",
                      "personName",
                      e.target.value,
                    )
                  }
                  error={!!errors["recipient.personName"]}
                  helperText={errors["recipient.personName"]}
                  fullWidth
                />

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Phone Number (optional)"
                    value={formData.recipient?.phone?.phoneNumber || ""}
                    onChange={(e) =>
                      handlePersonPhoneChange(
                        "recipient",
                        "phoneNumber",
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.recipient?.phone?.preferred || false}
                        onChange={(e) =>
                          handlePersonPhoneChange(
                            "recipient",
                            "preferred",
                            e.target.checked,
                          )
                        }
                      />
                    }
                    label="Preferred"
                  />
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <TextField
                    label="Address (optional)"
                    value={formData.recipient?.address?.address || ""}
                    onChange={(e) =>
                      handlePersonAddressChange(
                        "recipient",
                        "address",
                        e.target.value,
                      )
                    }
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          formData.recipient?.address?.preferred || false
                        }
                        onChange={(e) =>
                          handlePersonAddressChange(
                            "recipient",
                            "preferred",
                            e.target.checked,
                          )
                        }
                      />
                    }
                    label="Preferred"
                  />
                </Stack>
              </Stack>
            </Box>

            {/* Order Items */}
            <Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6">Order Items</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addItem}
                >
                  Add Item
                </Button>
              </Stack>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                {formData.items?.map((item, index) => (
                  <Paper
                    key={`item-${item.itemId}-${crypto.randomUUID()}`}
                    sx={{ p: 2, bgcolor: "grey.50" }}
                  >
                    <Stack spacing={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="subtitle2">
                          Item {index + 1}
                        </Typography>
                        {(formData.items?.length || 0) > 1 && (
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => removeItem(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Item ID"
                          type="number"
                          value={item.itemId}
                          onChange={(e) =>
                            handleItemChange(index, "itemId", e.target.value)
                          }
                          error={!!errors[`items.${index}.itemId`]}
                          helperText={errors[`items.${index}.itemId`]}
                          fullWidth
                          slotProps={{ htmlInput: { min: 1 } }}
                        />

                        <TextField
                          label="Quantity"
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          error={!!errors[`items.${index}.quantity`]}
                          helperText={errors[`items.${index}.quantity`]}
                          fullWidth
                          slotProps={{ htmlInput: { min: 1, max: 10000 } }}
                        />
                      </Stack>

                      <Stack direction="row" spacing={2}>
                        <TextField
                          label="Item Name (optional snapshot)"
                          value={item.itemName || ""}
                          onChange={(e) =>
                            handleItemChange(index, "itemName", e.target.value)
                          }
                          fullWidth
                        />

                        <TextField
                          label="Item Price (optional snapshot)"
                          type="number"
                          value={item.itemPrice || ""}
                          onChange={(e) =>
                            handleItemChange(index, "itemPrice", e.target.value)
                          }
                          fullWidth
                          slotProps={{ htmlInput: { min: 1 } }}
                        />
                      </Stack>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => {
                  void navigate(`/orders/${id}`);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                onClick={(e) => {
                  void handleSubmit(e);
                }}
              >
                {isSubmitting ? "Updating..." : "Update Order"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default OrderEditPage;
