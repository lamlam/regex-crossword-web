interface HintLabelProps {
  hint: string;
  result?: boolean | null;
}

export function HintLabel({ hint, result }: HintLabelProps) {
  let className = "hint-label";
  if (result === true) className += " hint-label--correct";
  if (result === false) className += " hint-label--incorrect";

  return <span className={className}>{hint}</span>;
}
