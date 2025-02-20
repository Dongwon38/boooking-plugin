// Step4CustomerInfo.js

import { useState } from "react";

export default function CustomerInfo({ onBack, onConfirm, onClick }) {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (customer.name && customer.phone && customer.email) {
      onConfirm(customer);
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Enter Your Information</h2>
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={customer.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={customer.phone}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={customer.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </div>
  );
}
