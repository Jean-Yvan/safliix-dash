import React, { useEffect, useRef, useState } from "react";
import InputField from "@/ui/components/inputField";


type OptionType = { label: string; value: string };

type SuggestionsInputProps = {
  className?: string;
  optionList: OptionType[];
  value: string; // on stocke toujours l'ID
  onChange: (newValue: string) => void;
};

const SuggestionsInput = ({ className, optionList, value, onChange }: SuggestionsInputProps) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = optionList.find(opt => opt.value === value);
  const currentDisplay = searchText || selectedOption?.label || "";

  const suggestionArr = optionList.filter((suggestion) =>
    suggestion.label.toLowerCase().includes(currentDisplay.toLowerCase())
  );

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    onChange(e.target.value);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <InputField
        name="suggestionInput"
        type="text"
        onChange={changeHandler}
        onFocus={() => setShowDropdown(true)}
        value={currentDisplay}
        className={className}
      />
      {showDropdown && (
        <div className="absolute top-10 right-0 left-0 w-full max-h-[150px] overflow-auto z-10 p-2 bg-white border border-gray-300 shadow-lg">
          {suggestionArr.length > 0 ? (
            suggestionArr.map((suggestion, index) => (
              <div
                key={"suggestion_" + index}
                className="p-2 bg-gray-100 text-black cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  onChange(suggestion.value); // stocke l'id
                  setSearchText(""); // efface la recherche
                  setShowDropdown(false);
                }}
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
