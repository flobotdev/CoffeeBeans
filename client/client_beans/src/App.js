import "./App.css";
import CoffeeGrid from "./components/BeansGrid";
import BeansOfTheDay from "./components/BeansOfTheDay";
import Header from "./components/Header";
import CartModal from "./components/CartModal";
import CheckoutForm from "./components/CheckoutForm";
import ThankYou from "./components/ThankYou";
import { useState } from "react";

function App() {
  const [orderItems, setOrderItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const orderCount = orderItems.length;
  const addToOrder = (bean) => {
    setOrderItems((prev) => [...prev, bean]);
  };

  const removeFromOrder = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleOrderSubmit = (formData) => {
    // Here you would typically send the order to a backend
    console.log("Order submitted:", { items: orderItems, customer: formData });

    // Clear cart and show thank you
    setOrderItems([]);
    setIsCheckoutOpen(false);
    setShowThankYou(true);
  };

  return (
    <div className="coffee-page">
      <Header orderCount={orderCount} onCartClick={openCart} />
      <BeansOfTheDay handleAddToOrder={addToOrder} />
      <CoffeeGrid handleAddToOrder={addToOrder} />
      {isCartOpen && (
        <CartModal
          orderItems={orderItems}
          onClose={closeCart}
          onRemoveItem={removeFromOrder}
          onCheckout={openCheckout}
        />
      )}
      {isCheckoutOpen && (
        <CheckoutForm
          total={orderItems.reduce((sum, item) => sum + item.Cost, 0)}
          onSubmit={handleOrderSubmit}
          onCancel={closeCheckout}
        />
      )}
      {showThankYou && (
        <ThankYou
          onClose={() => {
            setShowThankYou(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
