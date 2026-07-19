import { useEffect, useRef } from "react";

export const useAutoScroll = (dependencies) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, dependencies); // It will run whenever the dependencies array changes!

  return scrollRef;
};
