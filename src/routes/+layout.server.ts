import { hydrateAuth } from "svelte-google-auth";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ locals }) => {
  return { ...hydrateAuth(locals) };
};
