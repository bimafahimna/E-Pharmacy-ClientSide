export const Header = (value: string) => {
  return value.toUpperCase().split("_").join(" ");
};

export const Filter = (value: string) => {
  return value.split("_").join(" ");
};
