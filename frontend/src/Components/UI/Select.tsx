import React from "react";

const Select = ({ label, ...props }) => {
  const { typeOfOptions, default_option } = props;
//   const optionsList = [
//     organization: {

//     }
//   ];
  return (
    <div>
      <label>{label}</label>
      <select>
        <option value="" selected disabled>{default_option}</option>
      </select>
    </div>
  );
};

export default Select;
