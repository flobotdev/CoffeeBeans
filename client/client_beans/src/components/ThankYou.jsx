import "./ThankYou.css";

export default function ThankYou({ onClose }) {
  return (
    <div className="thank-you-overlay">
      <div className="thank-you-modal">
        <div className="thank-you-content">
          <div className="success-icon">✓</div>
          <h2>Thank You for Your Order!</h2>
          <p>
            Your coffee beans are on their way. We'll send you a confirmation
            email shortly.
          </p>
          <button className="continue-btn" onClick={onClose}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
