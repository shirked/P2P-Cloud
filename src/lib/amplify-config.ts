import { Amplify } from "aws-amplify";

const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "";
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";

export function configureAmplify() {
  if (USER_POOL_ID && CLIENT_ID) {
    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
    
    // dynamically detect real Vercel URL if possible, otherwise fallback
    let currentOrigin = "https://flowvolt-frontend.vercel.app/";
    if (typeof window !== "undefined") {
      currentOrigin = window.location.origin + "/";
    }
    const baseUrl = isLocalhost ? "http://localhost:3000" : currentOrigin.replace(/\/$/, "");
    const redirectSignInUrl = `${baseUrl}/auth/callback`;
    const redirectSignOutUrl = `${baseUrl}/`;

    // Sanitize domain (remove https:// and trailing slashes) if user pasted it wrong
    let rawDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "";
    const cleanDomain = rawDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    console.log("[Amplify Config] Initializing with Redirect:", redirectSignInUrl);
    console.log("[Amplify Config] Using Domain:", cleanDomain);

    try {
      Amplify.configure({
        Auth: {
          Cognito: {
            userPoolId: USER_POOL_ID,
            userPoolClientId: CLIENT_ID,
            loginWith: {
              oauth: {
                domain: cleanDomain,
                scopes: ["email", "openid", "profile"],
                redirectSignIn: [redirectSignInUrl],
                redirectSignOut: [redirectSignOutUrl],
                responseType: "code",
              },
            },
          },
        },
      });
      console.log("[Amplify Config] Initialization successful.");
    } catch (e) {
      console.error("[Amplify Config] Initialization failed:", e);
    }
  } else {
    console.warn("[Amplify Config] Missing User Pool ID or Client ID. Skipping configuration.");
  }
}
