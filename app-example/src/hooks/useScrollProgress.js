import { useEffect, useState, useCallback } from "react";
import { useThrottledFn } from "beautiful-react-hooks";

export default function useScrollProgress(throttle = true) {
  const mountValue = { percent: "0%", px: 0 };
  const [progress, setProgress] = useState(mountValue);

  const handleScroll = useCallback(
    e => {
      const winScroll =
        document.body.scrollTop || document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      if (height > 0) {
        setProgress({
          percent: `${scrolled}%`,
          px: winScroll
        });
      } else {
        setProgress(mountValue);
      }
    },
    [mountValue]
  );

  // const handleScroll = e => {
  //   const winScroll =
  //     document.body.scrollTop || document.documentElement.scrollTop;
  //   const height =
  //     document.documentElement.scrollHeight -
  //     document.documentElement.clientHeight;
  //   const scrolled = (winScroll / height) * 100;
  //   if (height > 0) {
  //     setProgress({
  //       percent: `${scrolled}%`,
  //       px: winScroll
  //     });
  //   } else {
  //     setProgress(mountValue);
  //   }
  // };

  const throttledHandleScroll = useThrottledFn(handleScroll);

  useEffect(() => {
    window.addEventListener(
      "scroll",
      throttle ? throttledHandleScroll : handleScroll
    );
    return () =>
      window.removeEventListener(
        "scroll",
        throttle ? throttledHandleScroll : handleScroll
      );
  }, [throttle, throttledHandleScroll, handleScroll]);

  // useEffect(() => {
  //   // handleScroll();
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // });

  return [progress.percent, progress.px];
}
