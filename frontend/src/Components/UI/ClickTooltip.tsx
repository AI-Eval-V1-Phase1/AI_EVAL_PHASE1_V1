import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface ClickTooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

const ClickTooltip = ({ children, content, position = "top" }: ClickTooltipProps) => {
  const [open, setOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const toggleTooltip = () => setOpen(!open);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Position styles
  const positions: Record<string, React.CSSProperties> = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: "6px" },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "6px" },
    left: { right: "100%", top: "125px", transform: "translateY(-50%)", margin: "margin: 0 3px 0px 4px" },
    right: { left: "125px", top: "50%", transform: "translateY(-50%)", marginLeft: "6px" },
  };

  return (
    <div   className="labelInfo"ref={tooltipRef}>
      <span onClick={toggleTooltip} style={{ cursor: "pointer", display: "inline-flex" }}>
        {children}
      </span>

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 50,
            backgroundColor: "#374151",
            color: "white",
            fontSize: "0.875rem",
            padding: "6px 10px",
            borderRadius: "4px",
            width: "350px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            ...positions[position],
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default ClickTooltip;
