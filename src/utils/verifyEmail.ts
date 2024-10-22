export const isEmailValid = (email: string): boolean => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
};

export function verifyEmail(email: string) {
  if (email.split(" ").join() === "" || email === "") {
    throw new Error("Email can't empty");
  }

  if (email.includes(" ")) {
    throw new Error("Invalid email format");
  }

  if (!isEmailValid(email)) {
    throw new Error("Invalid email format");
  }
}
