import { useEffect, useState } from "react";
import type {
  Item,
  ItemFilter,
  ItemListResponse,
  ItemSortField,
} from "./domains/item/types";
import { listItems } from "./domains/item/item-api";

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<ItemListResponse["meta"] | null>(null);

  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<ItemSortField>("itemName");
  const [mode, setMode] = useState<"and" | "or">("and");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function fetchItems() {
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
  }

  useEffect(() => {
    fetchItems();
  }, [page]);

  const applyFilters = () => {
    setPage(1);
    fetchItems();
  };

  return (
    <>
      <h1>Item List</h1>

      <div>
        <input
          placeholder="Item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />
        <input
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as ItemSortField)}
        >
          <option value="itemName">itemName</option>
          <option value="price">price</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
        >
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as "and" | "or")}
        >
          <option value="and">and</option>
          <option value="or">or</option>
        </select>

        <input
          type="number"
          min={1}
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        />

        <button onClick={applyFilters}>Apply</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.itemId}>
              <td>{item.itemId}</td>
              <td>{item.itemName}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {meta && (
        <div>
          <button
            disabled={!meta.hasPrevious}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <span>
            Page {meta.page} / {meta.totalPages}
          </span>

          <button
            disabled={!meta.hasNext}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default App;
