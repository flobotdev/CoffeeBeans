import { useState } from "react";
import "./CheckoutForm.css";

export default function CheckoutForm({ total, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    email: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.address && formData.email) {
      onSubmit(formData);
    }
  };

  return (
    <div className="checkout-form-overlay">
      <div className="checkout-form">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <p className="total-amount">Total: £{total.toFixed(2)}</p>
        </div>

        <form onSubmit={handleSubmit} className="checkout-form-fields">
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Delivery Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your full delivery address"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}