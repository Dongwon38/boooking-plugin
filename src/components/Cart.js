import React from "react";

const Cart = ({ cart, removeFromCart }) => {
  const handleCheckout = () => {
    window.location.href = "https://dongwonk4.sg-host.com/checkout/";
  };

  return (
    <div>
      <h2>장바구니</h2>
      {cart.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.key}>
                {item.name} - ${item.price} x {item.quantity}
                <button onClick={() => removeFromCart(item.key)}>삭제</button>
              </li>
            ))}
          </ul>
          <button onClick={handleCheckout}>체크아웃</button>
        </>
      )}
    </div>
  );
};

export default Cart;
