import { Routes, Route, Link } from "react-router-dom";
import ItemListPage from "./pages/ItemListPage";
import ItemCreatePage from "./pages/ItemCreatePage";
import ItemDetailPage from "./pages/ItemDetailPage";
import ItemEditPage from "./pages/ItemEditPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/items">Items</Link>
      </nav>
      <Routes>
        <Route path="/items" element={<ItemListPage />} />
        <Route path="/items/create" element={<ItemCreatePage />} />
        <Route path="/items/:id" element={<ItemDetailPage />} />
        <Route path="/items/:id/edit" element={<ItemEditPage />} />
      </Routes>
    </div>
  );
}

export default App;
