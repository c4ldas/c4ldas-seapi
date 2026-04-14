import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleToggle(event) {
    const newTheme = event.target.checked ? "dark" : "light";
    setTheme(newTheme);
  }

  return (
    <label className="switch">
      <input
        type="checkbox"
        id="theme-toggle"
        title="dark-mode"
        checked={resolvedTheme === "dark"}
        onChange={handleToggle}
      />
      <span className="slider"><span className="mode"></span></span>
    </label>
  );
}
