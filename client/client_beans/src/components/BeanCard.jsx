import { useState } from "react";
import BeanDetailsModal from "./BeanDetailsModal";
import AddToOrderButton from "./AddToOrderButton";

export default function BeanCard({ bean, onAddToOrder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="coffee-card">
      {bean.isBOTD && <span className="botd-badge">Today’s Pick</span>}

      <img src={bean.Image} alt={bean.Name} />

      <h3>{bean.Name}</h3>
      <p className="roast">{bean.colour}</p>
      <p className="country">{bean.Country}</p>
      <p className="price">£{Number(bean.Cost).toFixed(2)}</p>

      <div className="card-actions">
        <button className="details-btn" onClick={() => setOpen(true)}>
          More Details
        </button>
        <AddToOrderButton bean={bean} onAdd={onAddToOrder} />
      </div>
      {open && <BeanDetailsModal bean={bean} onClose={() => setOpen(false)} />}
    </div>
  );
}
