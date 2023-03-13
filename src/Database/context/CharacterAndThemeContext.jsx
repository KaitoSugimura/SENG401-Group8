import { createContext, useEffect, useReducer } from "react";

export const CharacterAndThemeContext = createContext();

export const charReducer = (state, action) => {
  switch (action.type) {
    case "CHARACTER":
      const slimeName = action.payload + "Slime";
      return {
        ...state,
        selectedSlimeType: action.payload,
        selectedSlimePath:
          "assets/GameArt/" + slimeName + "/" + slimeName + ".svg",
      };
    default:
      return state;
  }
};

export const CharacterAndThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(charReducer, {
    selectedSlimeType: "Normal",
    selectedSlimePath: "assets/GameArt/NormalSlime/NormalSlime.png",
  });

  const changeSlimeType = (type) => {
    dispatch({ type: "CHARACTER", payload: type });
  };

  return (
    <CharacterAndThemeContext.Provider value={{ ...state, changeSlimeType }}>
      {children}
    </CharacterAndThemeContext.Provider>
  );
};
