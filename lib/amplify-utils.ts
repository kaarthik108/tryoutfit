import { type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import { cookies } from "next/headers";

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
  authMode: "apiKey",
});

// import { Schema } from "@/amplify/data/resource";
// import { Amplify } from "aws-amplify";
// import { generateClient } from "aws-amplify/data";

// Amplify.configure(outputs);

// export const cookieBasedClient = generateClient<Schema>();
