import { createPortal } from "react-dom";
import "./CartModal.css";

export default function CartModal({
  orderItems,
  onClose,
  onRemoveItem,
  onCheckout,
}) {
  const totalPrice = orderItems.reduce((sum, item) => sum + item.Cost, 0);

  return createPortal(
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-items">
          {orderItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            orderItems.map((item, index) => (
              <div key={`${item._id}-${index}`} className="cart-item">
                <img
                  src={item.Image}
                  alt={item.Name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.Name}</h3>
                  <p className="cart-item-country">{item.Country}</p>
                  <p className="cart-item-roast">{item.colour}</p>
                  <p className="cart-item-price">£{item.Cost.toFixed(2)}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => onRemoveItem(index)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {orderItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <strong>Total: £{totalPrice.toFixed(2)}</strong>
            </div>
            <button className="checkout-btn" onClick={onCheckout}>
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
