import { SvelteGoogleAuthHook } from "svelte-google-auth";
import type { Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const auth = new SvelteGoogleAuthHook({
  client_id: env.AUTH_GOOGLE_CLIENT_ID,
  client_secret: env.AUTH_GOOGLE_CLIENT_SECRET,
  jwt_secret: env.AUTH_JWT_SECRET,
});

export const handle: Handle = async ({ event, resolve }) => {
  return await auth.handleAuth({ event, resolve });
};
