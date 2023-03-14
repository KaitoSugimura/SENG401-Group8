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
          "assets/GameArt/" + slimeName + "/" + slimeName + action.payload2 + ".svg",
      };
    default:
      return state;
  }
};

export const CharacterAndThemeContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(charReducer, {
    selectedSlimeType: "Normal",
    selectedSlimePath: "assets/GameArt/NormalSlime/NormalSlime1.svg",
  });

  const setSlimeTypeAndSkin = (type, skin) => {
    dispatch({ type: "CHARACTER", payload: type, payload2: skin });
  };

  return (
    <CharacterAndThemeContext.Provider value={{ ...state, setSlimeTypeAndSkin }}>
      {children}
    </CharacterAndThemeContext.Provider>
  );
};
