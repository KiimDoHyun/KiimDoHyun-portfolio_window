import { useEffect, useState } from "react";

export default function useScreenHeight() {
  const [screenHeight, setScreenHeight] = useState(0);

  useEffect(() => {
    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };
    updateScreenHeight();
    window.addEventListener("resize", updateScreenHeight);
    return () => window.removeEventListener("resize", updateScreenHeight);
  }, []);

  return screenHeight;
}
