import { createContext } from "react";

export const GetAdverseAnswerContext = createContext({
  getAdverseStep3: "",
  setGetAdverseStep3: (answer) => {},
});
