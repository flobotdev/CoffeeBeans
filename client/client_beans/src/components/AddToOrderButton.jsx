import "./AddToOrderButton.css";

export default function AddToOrderButton({ bean, onAdd, className = "" }) {
  const handleClick = () => {
    onAdd(bean);
  };

  return (
    <button className={`add-to-order-btn ${className}`} onClick={handleClick}>
      Add to Order
    </button>
  );
}
