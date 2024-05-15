"use client";

import type { FC} from "react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";

import { Button } from "./ui/button";

interface DarkModeButtonProps {
  className?: string;
}

const DarkModeButton: FC<DarkModeButtonProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      size="lg"
      className={className}
      onClick={() => (theme === "dark" ? setTheme("light") : setTheme("dark"))}
    >
      {theme === "dark" ? <FaMoon size={20} /> : <FaSun size={20} />}
    </Button>
  );
};

export default DarkModeButton;
