import { useState } from "react";
import beans from "../data/AllTheBeans.json";
import BeanCard from "./BeanCard";
import "./BeansGrid.css";

export default function CoffeeGrid({ handleAddToOrder }) {
  const [search, setSearch] = useState("");

  const filteredBeans = beans.filter(bean =>
    bean.Name.toLowerCase().includes(search.toLowerCase()) ||
    bean.Country.toLowerCase().includes(search.toLowerCase()) ||
    bean.colour.toLowerCase().includes(search.toLowerCase())
  );

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
        {filteredBeans.map(bean => (
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
