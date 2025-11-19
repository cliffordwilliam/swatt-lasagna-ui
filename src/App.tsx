import { useEffect, useState } from "react"

export type Item = {
  id: number;
  itemName: string;
  price: number;
}

export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type ListItemResponse = {
  success: boolean;
  data: Item[];
  meta: PaginationMeta;
}

function App() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams({
        page: "1",
        pageSize: "10",
        sortOrder: "asc",
        sortField: "itemName",
        mode: "and",
      })
      const res = await fetch("http://localhost:3000/item?" + params.toString())
      const json: ListItemResponse = await res.json()
      setItems(json.data)
    })()
  }, [])

  return (
    <>
      <h1>Item List</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.itemName}</strong> — {item.price}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App

