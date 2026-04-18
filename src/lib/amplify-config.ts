import { Amplify } from "aws-amplify";

const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "";
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";

export function configureAmplify() {
  if (USER_POOL_ID && CLIENT_ID) {
    const isLocalhost = typeof window !== "undefined" && window.location.hostname === "localhost";
    const redirectUrl = isLocalhost ? "http://localhost:3000/" : "https://flowvolt-frontend.vercel.app/";

    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: USER_POOL_ID,
          userPoolClientId: CLIENT_ID,
          loginWith: {
            oauth: {
              domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN || "", // Should look like: your-app.auth.us-east-1.amazoncognito.com
              scopes: ["email", "openid", "profile"],
              redirectSignIn: [redirectUrl],
              redirectSignOut: [redirectUrl],
              responseType: "code",
            },
          },
        },
      },
    });
  }
}
