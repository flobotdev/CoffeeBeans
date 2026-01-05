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

        <img src={bean.image} alt={bean.name} />
        <h2>{bean.name}</h2>
        <p>
          <strong>Roast:</strong> {bean.colour}
        </p>
        <p>
          <strong>Country:</strong> {bean.country}
        </p>
        <p>
          <strong>Price:</strong> £{Number(bean.cost).toFixed(2)}
        </p>
        <p className="description">{bean.description}</p>
        <AddToOrderButton bean={bean} onAdd={addToOrder} />
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
