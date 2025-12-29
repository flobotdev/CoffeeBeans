import { useState, useEffect } from "react";
import { getBeansOfTheDay } from "../services/apiService";
import BeanCard from "./BeanCard";
import "./BeansOfTheDay.css";

export default function BeansOfTheDay({ handleAddToOrder }) {
  const [botdBean, setBotdBean] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBeansOfTheDay = async () => {
      try {
        setLoading(true);
        const bean = await getBeansOfTheDay();
        setBotdBean(bean);
      } catch (err) {
        setError("Failed to load bean of the day");
        console.error("Error loading bean of the day:", err);
      } finally {
        setLoading(false);
      }
    };

    loadBeansOfTheDay();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return null;
  if (!botdBean) return null;

  return (
    <section className="botd-section">
      <h2 className="botd-title">☕ Bean of the Day</h2>

      <div className="botd-grid">
        <BeanCard
          key={botdBean.id}
          bean={botdBean}
          onAddToOrder={handleAddToOrder}
        />
      </div>
    </section>
  );
}
