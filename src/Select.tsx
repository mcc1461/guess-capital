import React, { useEffect, useState } from "react";
import styles from "./Select.module.css";

export type SelectOption = {
  country: string;
  capital: string;
};

type MultipleSelectProps = {
  multiple: true;
  asked: SelectOption[];
  choiceGroup: string[];
  onChange: (asked: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  asked: SelectOption | undefined;
  choiceGroup: string[];
  onChange: (asked: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

function Select({ multiple, asked, onChange, options, choiceGroup }: SelectProps) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const mappedOptions = choiceGroup.map((capital) => ({
    country: options.find((opt) => opt.capital === capital)?.country || '',
    capital,
  }));

  function clearOptions() {
    if (multiple) {
      onChange([]);
    } else {
      onChange(undefined);
    }
  }

  function selectOption(option: SelectOption) {
    if (multiple) {
      const selectedOptions = asked as SelectOption[];
      if (selectedOptions.some((o) => o.capital === option.capital)) {
        onChange(selectedOptions.filter((o) => o.capital !== option.capital));
      } else if (selectedOptions.length < 3) {
        onChange([...selectedOptions, option]);
      }
    } else {
      onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    return multiple
      ? (asked as SelectOption[]).some((o) => o.capital === option.capital)
      : option === asked;
  }

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(null);
    }
  }, [isOpen]);

  return (
    <div
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.capital}>
        {multiple
          ? (asked as SelectOption[]).length === 0 ? (
              <span className={styles.placeholder}>Choose more than one</span>
            ) : (
              (asked as SelectOption[]).map((c) => (
                <button
                  key={c.country}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(c);
                  }}
                  className={styles["selected-option"]}
                >
                  {c.capital}
                  <span className={styles["remove-btn"]}>&times;</span>
                </button>
              ))
            )
          : asked ? (
              asked.capital
            ) : (
              <span className={styles.placeholder}>Select an option</span>
            )}
      </span>
      <button
        onClick={(e) => {
          clearOptions();
          e.stopPropagation();
        }}
        className={styles["clear-btn"]}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.arrow}>▼</div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {mappedOptions.map((option, index) => (
          <li
            key={option.country}
            className={`${styles.option} ${
              isOptionSelected(option) ? styles.selected : ""
            } ${highlightedIndex === index ? styles.highlighted : ""}`}
            onClick={(e) => {
              selectOption(option);
              e.stopPropagation();
              setIsOpen(false);
            }}
            onMouseEnter={() => setHighlightedIndex(index)}
            onMouseLeave={() => setHighlightedIndex(null)}
          >
            {option.capital}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Select;
