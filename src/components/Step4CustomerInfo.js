// Step4CustomerInfo.js

export default function CustomerInfo({ handleKeyDown, customerInfo, setCustomerInfo }) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    console.log(customerInfo);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Enter Your Information</h2>
      <div className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={customerInfo.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={customerInfo.phone}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={customerInfo.email}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
