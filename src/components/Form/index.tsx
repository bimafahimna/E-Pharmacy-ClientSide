import React, { ComponentProps } from "react";

interface FormProps extends ComponentProps<"form"> {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({ ...rest }: FormProps): JSX.Element {
  return <form {...rest} />;
}
