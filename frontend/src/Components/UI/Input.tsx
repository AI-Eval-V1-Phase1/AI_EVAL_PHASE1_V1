
type InputProps = {
  labelName: string | React.ReactNode;
  id: string;
  icon?: React.ReactNode;
  type?: "text" | "email" | "password" | "number" | "textarea";
  name: string;
  value: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  rows?: number;
  cols?: number;
};

const Input = ({
  labelName,
  id,
  icon,
  type = "text",
  name,
  value,
  onChange,
  rows = 4,
  cols,
}: InputProps) => {
  return (
    <div className="input_wrapper">
      <label htmlFor={id}>
        {icon && <span>{icon}</span>}
        {labelName}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          rows={rows}
          cols={cols}
          required
          onChange={onChange}
          className="textarea_field"
        />
      ) : (
        <input
          id={id}
          type={type}
          name={name}
          value={value}
          required
          onChange={onChange}
          className="input_field"
        />
      )}
    </div>
  );
};

export default Input;
