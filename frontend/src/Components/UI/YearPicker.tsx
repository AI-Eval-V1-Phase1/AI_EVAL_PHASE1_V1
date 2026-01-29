import React, { useState, useEffect } from "react";
import "../../styles/year_picker.css";

interface YearPickerProps {
  startYear?: number;
  endYear?: number;
  label?: React.ReactNode;
  value?: number;
  onChange?: (year: number) => void;
}

const YearPicker: React.FC<YearPickerProps> = ({
  startYear = 1950,
  endYear,
  label,
  value,
  onChange,
}) => {
  const currentYear = endYear ?? new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= startYear; y--) {
    years.push(y);
  }

  const [selectedYear, setSelectedYear] = useState<number | undefined>(value);

  useEffect(() => {
    setSelectedYear(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = parseInt(e.target.value, 10);
    setSelectedYear(year);
    if (onChange) onChange(year);
  };

  return (
    <div className="year-picker">
      {label && <label>{label}</label>}
      <select value={selectedYear ?? ""} onChange={handleChange}>
        <option value="">Select year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearPicker;
// 