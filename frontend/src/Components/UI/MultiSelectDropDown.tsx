// import React from "react";
import { useState } from "react";

interface OptionGroup {
  label: string;
  value: string;
}

interface MultiSelectProps {
  labelName: React.ReactNode;
  id: string;
  options: OptionGroup[];
  default_option: string;
}

const MultiSelectDropDown = ({
  labelName,
  id,
  options,
  default_option,
}: MultiSelectProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <>
      <label htmlFor={id}>{labelName}</label>
      <div className="dropdown_multi_select">
        <button type="button" onClick={() => setOpen(!open)}>
          {selected.length > 0 ? selected.join(", ") : default_option}
        </button>

        <div className={`menu ${open ? "open" : ""}`}>
          {options.map((group) => (
            <div key={group.label}>
              <label key={group.value}>
                <input
                  type="checkbox"
                  checked={selected.includes(group.label)}
                  onChange={() => toggle(group.label)}
                />
                <span> {group.label}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MultiSelectDropDown;
