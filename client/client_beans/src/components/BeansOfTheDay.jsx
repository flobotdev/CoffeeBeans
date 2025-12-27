import BeanCard from "./BeanCard";
import beans from "../data/AllTheBeans.json";
import "./BeansOfTheDay.css";

export default function BeansOfTheDay({ handleAddToOrder }) {
  const botdBeans = beans.filter(bean => bean.isBOTD);

  if (botdBeans.length === 0) return null;

  return (
    <section className="botd-section">
      <h2 className="botd-title">☕ Beans of the Day</h2>

      <div className="botd-grid">
        {botdBeans.map(bean => (
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
