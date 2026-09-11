import type { FieldError, FieldValues, Path, UseFormRegister } from "react-hook-form";

type TextAreaProps<T extends FieldValues> ={
    label: string;
    name: Path <T>;
    placeholder?: string;
    rows?: number;
    register: UseFormRegister<T>;
    error?: FieldError;
}

function TextArea<T extends FieldValues>(
    { label,
        name,
        placeholder,
        rows,
        register,
        error
    }:TextAreaProps<T>) {
  return (
      <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className="border rounded-md p-2 resize-none outline-0 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
      />
      {error && <span className="text-red-500 text-sm">{error.message}</span>}
    </div>
  )
}

export default TextArea