import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Stack,
  Alert,
} from "@mui/material";
import {
  ItemCreateSchema,
  type ItemCreateFormData,
} from "../domains/item/validation";
import { createItem } from "../domains/item/item-api";

function ItemCreatePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ItemCreateFormData>({
    itemName: "",
    price: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange =
    (field: keyof ItemCreateFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: field === "price" ? e.target.value : e.target.value,
      }));

      if (errors[field]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = ItemCreateSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createItem(result.data);
      if (response.success) {
        navigate(`/items/${response.data.itemId}`);
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Failed to create item",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Create New Item
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {apiError && <Alert severity="error">{apiError}</Alert>}

            <TextField
              label="Item Name"
              value={formData.itemName}
              onChange={handleChange("itemName")}
              error={!!errors.itemName}
              helperText={errors.itemName}
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange("price")}
              error={!!errors.price}
              helperText={errors.price}
              required
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 50_000_000,
                  step: 1,
                },
              }}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate("/items")}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Item"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default ItemCreatePage;
