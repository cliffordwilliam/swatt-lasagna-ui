import { Routes, Route, Link } from "react-router-dom";
import ItemListPage from "./pages/ItemListPage";
import ItemCreatePage from "./pages/ItemCreatePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemEditPage from "./pages/ItemEditPage";
import OrderListPage from "./pages/OrderListPage";
import OrderCreatePage from "./pages/OrderCreatePage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrderEditPage from "./pages/OrderEditPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/items">Items</Link>
        {" | "}
        <Link to="/orders">Orders</Link>
      </nav>
      <Routes>
        <Route path="/items" element={<ItemListPage />} />
        <Route path="/items/create" element={<ItemCreatePage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/items/:id/edit" element={<ItemEditPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/create" element={<OrderCreatePage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/orders/:id/edit" element={<OrderEditPage />} />
      </Routes>
    </div>
  );
}

export default App;
