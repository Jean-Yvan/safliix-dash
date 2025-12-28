import React, { useEffect, useRef, useState } from "react";
import InputField from "@/ui/components/inputField";


type OptionType = { label: string; value: string };

type SuggestionsInputProps = {
  className?: string;
  optionList: OptionType[];
  value: string;
  onChange: (newValue: string) => void;
};

const SuggestionsInput = ({ className, optionList, value, onChange }: SuggestionsInputProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value || "");

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = optionList.find((opt) => opt.value === value);

  const suggestionArr = optionList.filter((suggestion) =>
    suggestion.label.toLowerCase().includes(inputValue.toLowerCase()),
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    onChange(text);
    setShowDropdown(true);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        if (!selectedOption) {
          onChange(inputValue.trim());
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputValue, onChange, selectedOption]);

  const finalizeFreeText = () => {
    setShowDropdown(false);
    if (!selectedOption) {
      onChange(inputValue.trim());
    }
  };

  useEffect(() => {
    // Sync external value changes (prefill or reset)
    if (selectedOption) {
      setInputValue(selectedOption.label);
    } else if (value === "") {
      setInputValue("");
    } else {
      setInputValue(value);
    }
  }, [value, selectedOption, optionList]);

  const handleSelect = (suggestion: OptionType) => {
    onChange(suggestion.value);
    setInputValue(suggestion.label);
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestionArr.length > 0) {
        handleSelect(suggestionArr[0]);
      } else if (!selectedOption) {
        finalizeFreeText();
      }
    }
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <InputField
        name="suggestionInput"
        type="text"
        onChange={changeHandler}
        onFocus={() => setShowDropdown(true)}
        onBlur={finalizeFreeText}
        onKeyDown={handleKeyDown}
        value={inputValue}
        className={className}
      />
      {showDropdown && (
        <div className="absolute top-10 right-0 left-0 w-full max-h-[150px] overflow-auto z-10 p-2 bg-white border border-gray-300 shadow-lg">
          {suggestionArr.length > 0 ? (
            suggestionArr.map((suggestion, index) => (
              <div
                key={"suggestion_" + index}
                className="p-2 bg-gray-100 text-black cursor-pointer hover:bg-gray-200"
                onClick={() => handleSelect(suggestion)}
              >
                {suggestion.label}
              </div>
            ))
          ) : (
            <div className="p-2 text-gray-500">Aucune suggestion trouvée</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionsInput;
