export const Header = (value: string) => {
  return value.toUpperCase().split("_").join(" ");
};

export const Filter = (value: string) => {
  return value.split("_").join(" ");
};

export const ToggleSort = (value: "asc" | "desc") => {
  return value === "desc" ? "asc" : "desc";
};

export const InputLabel = (value: string) => {
  return value
    .split("_")
    .map((item) => {
      if (["in", "at"].includes(value)) return item;
      else {
        return item[0].toUpperCase() + item.slice(1, item.length);
      }
    })
    .join(" ");
};
