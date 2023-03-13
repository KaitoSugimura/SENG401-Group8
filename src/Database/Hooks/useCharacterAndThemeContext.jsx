import { CharacterAndThemeContext } from "../context/CharacterAndThemeContext";
import { useContext } from "react";

export const useCharacterAndThemeContext = () => {
  const context = useContext(CharacterAndThemeContext);

  if(!context){
    throw Error("useAuthContext error: Must be inside an AuthContextProvider")
  }

  return context;
};
