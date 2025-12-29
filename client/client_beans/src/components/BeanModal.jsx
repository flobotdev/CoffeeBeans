import { createPortal } from "react-dom";
import "./BeanModal.css";

export default function BeanModal({ bean, onClose, addToOrder }) {
  const handleAdd = () => {
    addToOrder(bean);
  };
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
          <strong>Price:</strong> ${bean.Cost.toFixed(2)}
        </p>
        <p className="description">{bean.Description}</p>
        <button className="add-btn" onClick={handleAdd}>
          Add to Order
        </button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
