import { createPortal } from "react-dom";
import "./BeanDetailsModal.css";
import AddToOrderButton from "./AddToOrderButton";

export default function BeanDetailsModal({ bean, onClose, addToOrder }) {
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close" onClick={onClose}>
          ×
        </button>

        <img src={bean.Image} alt={bean.Name} />
        <h2>{bean.Name}</h2>
        <p>
          <strong>Roast:</strong> {bean.colour}
        </p>
        <p>
          <strong>Country:</strong> {bean.Country}
        </p>
        <p>
          <strong>Price:</strong> £{bean.Cost.toFixed(2)}
        </p>
        <p className="description">{bean.Description}</p>
        <AddToOrderButton bean={bean} onAdd={addToOrder} />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
