import { Amplify } from "aws-amplify";

const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "";
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";

export function configureAmplify() {
  if (USER_POOL_ID && CLIENT_ID) {
    try {
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: USER_POOL_ID,
            userPoolClientId: CLIENT_ID,
          },
        },
      });
      console.log("[Amplify Config] Initialization successful (Native UI mode).");
    } catch (e) {
      console.error("[Amplify Config] Initialization failed:", e);
    }
  } else {
    console.warn("[Amplify Config] Missing User Pool ID or Client ID. Skipping configuration.");
  }
}
