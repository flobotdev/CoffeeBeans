import { useState, useEffect } from "react";
import { getBeansOfTheDay } from "../services/apiService";
import BeanCard from "./BeanCard";
import "./BeansOfTheDay.css";

export default function BeansOfTheDay({ handleAddToOrder }) {
  const [botdBeans, setBotdBeans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBeansOfTheDay = async () => {
      try {
        setLoading(true);
        const beans = await getBeansOfTheDay();
        setBotdBeans(beans);
      } catch (err) {
        setError("Failed to load beans of the day");
        console.error("Error loading beans of the day:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBeansOfTheDay();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return null;
  if (botdBeans.length === 0) return null;

  return (
    <section className="botd-section">
      <h2 className="botd-title">☕ Beans of the Day</h2>

      <div className="botd-grid">
        {botdBeans.map((bean) => (
          <BeanCard
            key={bean._id}
            bean={bean}
            onAddToOrder={handleAddToOrder}
          />
        ))}
      </div>
    </section>
  );
}
