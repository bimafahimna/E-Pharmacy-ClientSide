import { cartCardPersisted } from "./types";

export const loadState = (reduxState: string) => {
  try {
    const serialState = localStorage.getItem(reduxState);
    if (serialState === null) {
      return undefined;
    }
    return JSON.parse(serialState);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      return err;
    }
  }
};

export const saveState = (
  reduxState: string,
  state: cartCardPersisted[] | string
) => {
  try {
    const serialState = JSON.stringify(state);
    localStorage.setItem(reduxState, serialState);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err);
      return err;
    }
  }
};
