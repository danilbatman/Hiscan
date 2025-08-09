import { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = PropsWithChildren<{ className?: string }>;

export default function Card({ children, className }: Props) {
  return (
    <div className={clsx("border border-black rounded p-6 bg-white text-black", className)}>{children}</div>
  );
}