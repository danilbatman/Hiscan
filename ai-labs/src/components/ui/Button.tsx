import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "black" | "white" | "ghost";
};

export default function Button({ className, variant = "black", ...props }: Props) {
  const base = "px-4 py-2 rounded transition-colors text-sm border";
  const styles =
    variant === "black"
      ? "bg-black text-white border-black hover:bg-white hover:text-black"
      : variant === "white"
      ? "bg-white text-black border-black hover:bg-black hover:text-white"
      : "bg-transparent text-black border-transparent hover:bg-black hover:text-white";
  return <button className={clsx(base, styles, className)} {...props} />;
}