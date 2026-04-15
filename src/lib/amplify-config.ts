import { Amplify } from "aws-amplify";

const USER_POOL_ID = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || "";
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || "";

export function configureAmplify() {
  if (USER_POOL_ID && CLIENT_ID) {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId: USER_POOL_ID,
          userPoolClientId: CLIENT_ID,
        },
      },
    });
  }
}
