import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "tryout",
  access: (allow) => ({
    "img/*": [allow.guest.to(["read", "write"])],
  }),
});
