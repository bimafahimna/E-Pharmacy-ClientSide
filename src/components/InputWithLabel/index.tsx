import React, { ComponentProps } from "react";
import Input from "../Input";
import style from "./index.module.css";

interface InputProps extends ComponentProps<"input"> {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface InputWithLabelProps {
  inputProps: InputProps;
  labelProps: ComponentProps<"label">;
}

export default function InputWithLabel(
  props: InputWithLabelProps
): JSX.Element {
  return (
    <>
      <div className={style.InputWithLabel}>
        <label
          className={props.labelProps.className}
          htmlFor={props.labelProps.htmlFor}
        >
          {props.labelProps.children}
        </label>
        <Input {...props.inputProps} />
      </div>
    </>
  );
}
