import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  // On component mount, set the checkbox based on the theme
  useEffect(() => {
    const themeToggle = document.querySelector("#theme-toggle");
    themeToggle.checked = (theme === "dark");
  }, [theme]);

  return (
    <label className="switch">
      <input type="checkbox" id="theme-toggle" title="dark-mode" onClick={handleToggle} />
      <span className="slider"><span className="mode"></span></span>
    </label>
  )

  function handleToggle(event) {
    const newTheme = event.target.checked ? "dark" : "light";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  }
}
