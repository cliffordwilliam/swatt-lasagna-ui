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
  CircularProgress,
} from "@mui/material";
import {
  ItemUpdateSchema,
  type ItemUpdateFormData,
} from "../domains/item/validation";
import { getItem, updateItem } from "../domains/item/item-api";

function ItemEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ItemUpdateFormData>({
    itemName: "",
    price: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      if (!id) {
        setApiError("Invalid item ID");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getItem(Number(id));
        if (response.success) {
          setFormData({
            itemName: response.data.itemName,
            price: response.data.price,
          });
        }
      } catch (err) {
        setApiError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setIsLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  const handleChange =
    (field: keyof ItemUpdateFormData) =>
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

    if (!id) {
      setApiError("Invalid item ID");
      return;
    }

    const result = ItemUpdateSchema.safeParse(formData);
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
      const response = await updateItem(Number(id), result.data);
      if (response.success) {
        navigate(`/items/${id}`);
      }
    } catch (error) {
      setApiError(
        error instanceof Error ? error.message : "Failed to update item",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (apiError && !formData.itemName) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{apiError}</Alert>
        <Button
          variant="outlined"
          onClick={() => navigate("/items")}
          sx={{ mt: 2 }}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Edit Item
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
                onClick={() => navigate(`/items/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Item"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default ItemEditPage;
