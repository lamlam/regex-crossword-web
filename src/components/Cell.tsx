interface CellProps {
  value: string | null;
  selected: boolean;
  onClick: () => void;
}

export function Cell({ value, selected, onClick }: CellProps) {
  return (
    <button type="button" className={`cell${selected ? " cell--selected" : ""}`} onClick={onClick}>
      {value ?? ""}
    </button>
  );
}
