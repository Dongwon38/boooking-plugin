import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const menuItems = [
    { id: 264, name: 'Steak', price: 20 },
    { id: 265, name: 'Pizza', price: 15 },
    { id: 266, name: 'Coke', price: 3 },
    { id: 267, name: 'Sprite', price: 2.5 },
  ];

  const [cartItems, setCartItems] = useState([]);
  const wooCommerceUrl = 'https://dongwonk4.sg-host.com/wp-json/wc/v3';
  const consumerKey = 'ck_0fbeea6f2dd776ef96e059162c660950da4dd47c';
  const consumerSecret = 'cs_666fb32b68bddfa3e53d0d1d6d1f8ea2c2148544';

  // 카트에 아이템 추가
  const addToCart = (productId) => {
    const product = menuItems.find((item) => item.id === productId);
    if (!product) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    alert(`${product.name}이(가) 카트에 추가되었습니다!`);
  };

  // 카트에서 아이템 삭제
  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    alert('제품이 카트에서 삭제되었습니다!');
  };

  // 수량 업데이트
  const updateCartItem = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
    alert('카트가 업데이트되었습니다!');
  };

  // 체크아웃 처리
  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('카트가 비어 있습니다. 먼저 아이템을 추가해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${wooCommerceUrl}/cart/sync`,
        { items: cartItems },
        {
          auth: {
            username: consumerKey,
            password: consumerSecret,
          },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('서버 응답:', response.data); // 디버깅용 로그

      if (response.data.success) {
        alert('카트가 성공적으로 동기화되었습니다!');
        window.location.href = 'https://dongwonk4.sg-host.com/checkout/';
      } else {
        throw new Error(response.data.message || '카트 동기화 실패');
      }
    } catch (error) {
      console.error('체크아웃 오류:', error);
      const errorMessage =
        error.response?.data?.message || '서버 오류가 발생했습니다. 다시 시도해주세요.';
      alert(`카트 동기화 실패: ${errorMessage}`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>메뉴</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {menuItems.map((item) => (
          <li
            key={item.id}
            style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}
          >
            <span>
              {item.name} - ${item.price}
            </span>
            <button onClick={() => addToCart(item.id)}>카트에 추가</button>
          </li>
        ))}
      </ul>

      <h2>장바구니</h2>
      {cartItems.length === 0 ? (
        <p>카트가 비어 있습니다.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cartItems.map((item) => (
            <li
              key={item.id}
              style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}
            >
              <span style={{ flex: 1 }}>
                {item.name} - ${item.price} x {item.quantity}
              </span>
              <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
              <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
              <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '10px' }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={handleCheckout}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
      >
        결제하기
      </button>
    </div>
  );
};

export default App;