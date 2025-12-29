import { useState, useEffect } from "react";
import { getAllBeans, searchBeans } from "../services/apiService";
import BeanCard from "./BeanCard";
import "./BeansGrid.css";

export default function CoffeeGrid({ handleAddToOrder }) {
  const [search, setSearch] = useState("");
  const [allBeans, setAllBeans] = useState([]);
  const [filteredBeans, setFilteredBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all beans on component mount
  useEffect(() => {
    const loadBeans = async () => {
      try {
        setLoading(true);
        const beans = await getAllBeans();
        setAllBeans(beans);
        setFilteredBeans(beans);
      } catch (err) {
        setError("Failed to load beans. Make sure the API server is running.");
        console.error("Error loading beans:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBeans();
  }, []);

  // Filter beans when search changes
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredBeans(allBeans);
    } else {
      // Use API search
      const performSearch = async () => {
        try {
          const results = await searchBeans(search);
          setFilteredBeans(results);
        } catch (err) {
          console.error("Search error:", err);
          // Fallback to local filtering
          const localFiltered = allBeans.filter(
            (bean) =>
              bean.Name.toLowerCase().includes(search.toLowerCase()) ||
              bean.Country.toLowerCase().includes(search.toLowerCase()) ||
              bean.colour.toLowerCase().includes(search.toLowerCase())
          );
          setFilteredBeans(localFiltered);
        }
      };

      // Debounce search to avoid too many API calls
      const timeoutId = setTimeout(performSearch, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [search, allBeans]);

  if (loading) {
    return <div className="loading">Loading beans...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="coffee-list">
      {/* Search */}
      <input
        className="search-bar"
        type="text"
        placeholder="Search beans, country, or roast..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Main grid */}
      <div className="coffee-grid">
        {filteredBeans.map((bean) => (
          <BeanCard
            key={bean._id}
            bean={bean}
            onAddToOrder={handleAddToOrder}
          />
        ))}
      </div>
    </div>
  );
}
