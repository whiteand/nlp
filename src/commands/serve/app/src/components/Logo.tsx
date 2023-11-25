import { SVGAttributes } from "react";

export default function Logo({
  bgColor,
  iconColor,
  ...props
}: {
  className?: string;
  bgColor?: string;
  iconColor?: string;
} & SVGAttributes<SVGElement>) {
  const bg = bgColor || "#0c4a6e";
  const tx = iconColor || "#fff";

  return (
    <svg width="96" height="96" viewBox="0 0 96 96" {...props}>
      <circle cx="48" cy="48" r="48" fill={bg} />
      <g transform="translate(32, 21)">
        <rect x="0" y="0" width="8" height="8" fill={tx} />
        <rect x="13" y="0" width="8" height="8" fill={tx} />
        <g transform="translate(0, 16)">
          <path
            d="M 0 8 l 10 2 v 18 l -10 2 v 8 h 32 v -8 l -11 -2 v -28 h -21 z"
            fill={tx}
          />
        </g>
      </g>
    </svg>
  );
}
