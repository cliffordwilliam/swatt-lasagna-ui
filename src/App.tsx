import { Routes, Route, Link } from "react-router-dom";
import ItemListPage from "./pages/ItemListPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Items</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ItemListPage />} />
      </Routes>
    </div>
  );
}

export default App;
