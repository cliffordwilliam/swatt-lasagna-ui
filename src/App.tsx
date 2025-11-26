import { useEffect, useState } from "react";

export type Item = {
  id: number;
  itemName: string;
  price: number;
};

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ListItemResponse = {
  success: boolean;
  data: Item[];
  meta: PaginationMeta;
};

function ItemListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("itemName");
  const [mode, setMode] = useState("and");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function fetchItems() {
    const params = new URLSearchParams({
      sortOrder,
      sortField,
      mode,
      page: String(page),
      pageSize: String(pageSize),
    });

    if (itemName) params.set("itemName", itemName);
    if (price) params.set("price", price);

    const res = await fetch("http://localhost:3000/item?" + params.toString());
    const json: ListItemResponse = await res.json();

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
          onChange={(e) => setSortField(e.target.value)}
        >
          <option value="itemName">itemName</option>
          <option value="price">price</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">asc</option>
          <option value="desc">desc</option>
        </select>
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="and">and</option>
          <option value="or">or</option>
        </select>
        <input
          type="number"
          min={1}
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          placeholder="Page size"
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
            <tr key={item.id}>
              <td>{item.id}</td>
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
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {meta.page} / {meta.totalPages}
          </span>
          <button disabled={!meta.hasNext} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default ItemListPage;
