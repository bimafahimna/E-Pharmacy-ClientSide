const pick = (value: string, min: number, max?: number) => {
  let n,
    chars = "";

  if (typeof max === "undefined") {
    n = min;
  } else {
    n = min + Math.floor(Math.random() * (max - min + 1));
  }

  for (let i = 0; i < n; i++) {
    chars += value.charAt(Math.floor(Math.random() * value.length));
  }

  return chars;
};

const shuffle = (value: string) => {
  const array = value.split("");
  let tmp,
    current,
    top = array.length;

  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }

  return array.join("");
};

export const passwordGenerator = (): string => {
  const specials = "!@#$%^&*()_+{}:\"<>?|[];',./`~";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  const all = specials + lowercase + uppercase + numbers;

  let password = "";
  password += pick(numbers, 2);
  password += pick(specials, 2);
  password += pick(lowercase, 2);
  password += pick(uppercase, 2);
  password += pick(all, 7);
  password = shuffle(password);
  return password;
};
