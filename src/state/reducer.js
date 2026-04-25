export const initialState = {
  basket: [],
  user: null,
};

const reducer = (state, action) => {
  console.log(action); // ডিবাগিং এর জন্য ভালো

  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };

    case "EMPTY_BASKET":
      return {
        ...state,
        basket: [],
      };

    case "ADD_TO_BASKET":
      return {
        ...state,
        basket: [...state.basket, action.item],
      };

    case "REMOVE_FROM_BASKET":
      // বাস্কেটে আইটেমটি আছে কিনা চেক করা
      const index = state.basket.findIndex(
        (basketItem) => basketItem.id === action.id,
      );

      let newBasket = [...state.basket];

      if (index >= 0) {
        // আইটেমটি খুঁজে পেলে সেটি রিমুভ করা
        newBasket.splice(index, 1);
      } else {
        console.warn(
          `Can't remove product (id: ${action.id}) as it's not in basket!`,
        );
      }

      return {
        ...state,
        basket: newBasket,
      };

    default:
      return state;
  }
};

export default reducer;
