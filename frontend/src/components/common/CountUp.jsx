import { useEffect, useRef, useState } from 'react';

function parse(str) {
  const m = String(str).match(/^([^0-9]*)(\d+)([^0-9]*)$/);
  return m ? { pre: m[1], num: parseInt(m[2], 10), suf: m[3] } : { pre: '', num: 0, suf: str };
}

export default function CountUp({ value, className }) {
  const { pre, num, suf } = parse(value);
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return;
        fired.current = true;
        const duration = 1200;
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          setCount(Math.floor(p * num));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [num]);

  return (
    <span ref={ref} className={className}>
      {pre}{count}{suf}
    </span>
  );
}
