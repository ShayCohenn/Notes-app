import { useEffect, useState } from "react";

export const useOrigin = () => {
  const [mounted, setMouned] = useState(false);
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  useEffect(() => {
    setMouned(true);
  }, []);

  if (!mounted) return "";

  return origin;
};
