import React from "react";

const MenuList = ({ addToCart }) => {
  const menuItems = [
    { id: 264, name: "Steak", price: 20 },
    { id: 265, name: "Pizza", price: 15 },
    { id: 266, name: "Coke", price: 3 },
    { id: 267, name: "Sprite", price: 2.5 },
  ];

  return (
    <div>
      <h2>메뉴</h2>
      <ul>
        {menuItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
            <button onClick={() => addToCart(item)}>담기</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
