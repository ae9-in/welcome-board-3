import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  disabled?: boolean;
}

/**
 * React-bits inspired ShinyText — sweeps a soft highlight across the text.
 */
export function ShinyText({ text, className, speed = 4, disabled = false }: ShinyTextProps) {
  return (
    <span
      className={cn("shiny-text", disabled && "shiny-text--off", className)}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}

export default ShinyText;