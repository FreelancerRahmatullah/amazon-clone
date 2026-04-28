// ১. শুরুতে চেক করছি লোকাল স্টোরেজে আগে থেকে কোনো কার্ট ডাটা আছে কি না
const getBasketFromStorage = () => {
  const savedBasket = localStorage.getItem("basket");
  try {
    return savedBasket ? JSON.parse(savedBasket) : [];
  } catch (error) {
    return [];
  }
};

export const initialState = {
  basket: getBasketFromStorage(), // লোকাল স্টোরেজ থেকে ডাটা লোড করা
  user: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "EMPTY_BASKET":
      localStorage.removeItem("basket"); // কার্ট খালি করলে স্টোরেজ থেকেও মুছে ফেলা
      return {
        ...state,
        basket: [],
      };

    case "ADD_TO_BASKET":
      const updatedBasketAdd = [...state.basket, action.item];
      // লোকাল স্টোরেজে নতুন ডাটা সেভ করা
      localStorage.setItem("basket", JSON.stringify(updatedBasketAdd));
      return {
        ...state,
        basket: updatedBasketAdd,
      };

    case "REMOVE_FROM_BASKET":
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id
      );

      let newBasket = [...state.basket];

      if (index >= 0) {
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Can't remove product (id: ${action.id}) as it's not in basket!`
        );
      }

      // আপডেট হওয়া ডাটা লোকাল স্টোরেজে সেভ করা
      localStorage.setItem("basket", JSON.stringify(newBasket));
      return {
        ...state,
        basket: newBasket,
      };

    default:
      return state;
  }
};

export default reducer;