interface CharacterButtonsProps {
  alphabet: string;
  onInput: (char: string) => void;
  onClear: () => void;
  disabled: boolean;
}

export function CharacterButtons({ alphabet, onInput, onClear, disabled }: CharacterButtonsProps) {
  return (
    <div className="character-buttons">
      {[...alphabet].map((char) => (
        <button
          type="button"
          key={char}
          className="char-btn"
          disabled={disabled}
          onClick={() => onInput(char)}
        >
          {char}
        </button>
      ))}
      <button
        type="button"
        className="char-btn char-btn--clear"
        disabled={disabled}
        onClick={onClear}
      >
        Clear
      </button>
    </div>
  );
}
