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
  Item,
  ItemFilter,
  ItemListResponse,
  ItemSortField,
} from "../domains/item/types";
import { listItems } from "../domains/item/item-api";

function ItemListPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<ItemListResponse["meta"] | null>(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<ItemSortField>("itemName");
  const [mode, setMode] = useState<"and" | "or">("and");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const filter: ItemFilter = {
        sortOrder,
        sortField,
        mode,
        page,
        pageSize,
      };
      if (itemName.trim()) filter.itemName = itemName;
      if (price.trim()) filter.price = Number(price);
      const json = await listItems(filter);
      setItems(json.data);
      setMeta(json.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load items");
    } finally {
      setIsLoading(false);
    }
  }, [sortOrder, sortField, mode, page, pageSize, itemName, price]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems, page]);

  const applyFilters = () => {
    setPage(1);
    void fetchItems();
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
          Item List
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            void navigate("/items/create");
          }}
        >
          Create New Item
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
                label="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                sx={{ minWidth: 150 }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Sort Field</InputLabel>
                <Select
                  value={sortField}
                  label="Sort Field"
                  onChange={(e) =>
                    setSortField(e.target.value as ItemSortField)
                  }
                >
                  <MenuItem value="itemName">Item Name</MenuItem>
                  <MenuItem value="price">Price</MenuItem>
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
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow
                    key={item.itemId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{item.itemId}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell align="right">${item.price}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {
                            void navigate(`/items/${item.itemId}`);
                          }}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Item">
                        <IconButton
                          size="small"
                          onClick={() => {
                            void navigate(`/items/${item.itemId}/edit`);
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

export default ItemListPage;
