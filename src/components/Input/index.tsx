import React, { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ ...rest }: InputProps): JSX.Element {
  return <input {...rest} />;
}
