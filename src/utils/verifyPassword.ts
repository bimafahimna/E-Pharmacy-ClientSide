export function isPasswordValid(password: string): boolean {
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordPattern.test(password);
}

export function verifyPassword(password: string) {
  if (password.split(" ").join() === "" || password === "") {
    throw new Error("Password can't empty");
  }

  if (password.includes(" ")) {
    throw new Error(
      "Password should contain at least a lowercase, an uppercase, a digit, and a special character"
    );
  }

  if (!isPasswordValid(password)) {
    throw new Error(
      "Password should contain at least a lowercase, an uppercase, a digit, and a special character"
    );
  }
}
