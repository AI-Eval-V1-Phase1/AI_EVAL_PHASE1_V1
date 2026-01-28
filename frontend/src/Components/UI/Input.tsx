
type InputProps = {
  labelName: string;
  id: string;
  icon ?: React.ReactNode;
  type?: React.HTMLInputTypeAttribute;
  name: string;
  onChange ?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;

}

const Input = ({ labelName, id, ...props } : InputProps) => {
  // console.log(props);

  const {icon: Icon, type, name, value, onChange} = props;
  return (
    <>
      <label htmlFor={id}><span >{Icon}</span>{labelName}</label>
      <input id={id}  required type={type} name={name} value={value} onChange={onChange} />
    </>
  );
};

export default Input;
