import { useStateValue } from "../state/StateProvider";

const Checkout = () => {
  const [{ basket }, dispatch] = useStateValue();

  const removeFromBasket = (id) => {
    console.log("Removed id:", id);
    dispatch({
      type: "REMOVE_FROM_BASKET",
      id: id,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row p-5 bg-gray-100 max-w-screen-2xl mx-auto">
      {/* বাম পাশ: প্রোডাক্ট লিস্ট */}
      <div className="flex grow m-5 shadow-sm">
        <img
          className="w-full object-contain mb-5"
          src="https://shorturl.at/vuaEX"
          alt="Ad"
        />

        <div className="flex flex-col p-5 bg-white">
          <h1 className="text-3xl border-b pb-4 font-semibold">
            {basket?.length === 0
              ? "Your Shopping Basket is empty."
              : "Shopping Basket"}
          </h1>

          {basket.map((item, index) => (
            <div key={index} className="flex my-5 border-b pb-5">
              <img
                src={item.image}
                className="h-44 w-44 object-contain"
                alt=""
              />
              <div className="pl-5">
                <p className="text-lg font-bold">{item.title}</p>
                <p className="text-sm my-2">{item.description}</p>
                <p className="font-bold">${item.price}</p>
                <button
                  onClick={() => removeFromBasket(item.id)} // সরাসরি ফাংশনটি কল করুন
                  className="mt-2 bg-[#ffd814] px-4 py-1 rounded-sm border border-gray-300"
                >
                  Remove from Basket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ডান পাশ: সাবটোটাল */}
      <div className="flex flex-col bg-white p-10 shadow-md">
        <h2 className="whitespace-nowrap text-lg">
          Subtotal ({basket?.length} items):{" "}
          <span className="font-bold">
            $
            {basket
              .reduce((amount, item) => item.price + amount, 0)
              .toLocaleString()}
          </span>
        </h2>
        <button className="bg-[#ffd814] hover:bg-[#f7ca00] border border-[#fcd200] p-2 rounded-md mt-4 w-full">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Checkout;
