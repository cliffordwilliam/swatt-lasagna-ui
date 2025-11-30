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
} from "@mui/material";
import { getItem } from "../domains/item/item-api";
import type { Item } from "../domains/item/types";

function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      if (!id) {
        setError("Invalid item ID");
        setIsLoading(false);
        return;
      }

      try {
        const response = await getItem(Number(id));
        if (response.success) {
          setItem(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load item");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchItem();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || "Item not found"}</Alert>
        <Button
          variant="outlined"
          onClick={() => {
            void navigate("/items");
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

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h3" component="h1">
          Item Details
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={() => {
              void navigate("/items");
            }}
          >
            Back to List
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              void navigate(`/items/${id}/edit`);
            }}
          >
            Edit Item
          </Button>
        </Stack>
      </Stack>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Item ID
            </Typography>
            <Typography variant="h6">{item.itemId}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Item Name
            </Typography>
            <Typography variant="h6">{item.itemName}</Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="overline" color="text.secondary">
              Price
            </Typography>
            <Typography variant="h6">${item.price.toLocaleString()}</Typography>
          </Stack>

          <Stack direction="row" spacing={3}>
            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Created At
              </Typography>
              <Typography variant="body1">
                {formatDate(item.createdAt)}
              </Typography>
            </Stack>

            <Stack spacing={1} flex={1}>
              <Typography variant="overline" color="text.secondary">
                Updated At
              </Typography>
              <Typography variant="body1">
                {formatDate(item.updatedAt)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}

export default ItemDetailPage;
