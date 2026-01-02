import { FaShoppingBasket } from "react-icons/fa";
import "./Header.css";

export default function Header({ orderCount, onCartClick }) {
  return (
    <header className="header-bar">
      <h1 className="shop-name">All The Beans</h1>
      <div
        className="basket"
        onClick={onCartClick}
        style={{ cursor: "pointer" }}
      >
        <FaShoppingBasket size={24} />
        {orderCount > -1 && <span className="basket-count">{orderCount}</span>}
      </div>
    </header>
  );
}
