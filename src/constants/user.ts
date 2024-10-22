import { user } from "../utils/types";

export const UserKeys: (keyof user)[] = [
  "email",
  "role",
  "is_verified",
  "created_at",
  "updated_at",
];

export const UserFilterKeys: (keyof user)[] = ["role", "email", "is_verified"];

export const UserSortKeys: (keyof user)[] = ["created_at"];
