import { use } from "react";
import { ThemeContext } from "../Contexts/ThemeContext/ThemeContext";

const useTheme = () => use(ThemeContext);

export default useTheme;
