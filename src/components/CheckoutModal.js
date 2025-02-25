import React, { useState } from "react";

const TAX_RATE = 0.1; // 10% 세금

const CheckoutModal = ({ cart, onClose }) => {
  const [tip, setTip] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax + tip;

  return (
    <div style={{ border: "1px solid black", padding: "20px", background: "white" }}>
      <h2>주문서 리뷰</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.key}>
            {item.name} - ${item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <p>세금 (10%): ${tax.toFixed(2)}</p>

      <label>
        팁 추가: $
        <input type="number" value={tip} onChange={(e) => setTip(Number(e.target.value))} />
      </label>

      <h3>총 금액: ${total.toFixed(2)}</h3>

      <button onClick={() => alert("결제 페이지로 이동!")}>체크아웃</button>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default CheckoutModal;
