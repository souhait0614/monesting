import { redirect } from "@sveltejs/kit";
import { isSignedIn } from "svelte-google-auth";
import type { LayoutServerLoad } from "../$types";
import { enableNotification } from "$lib/env";

export const load = (({ locals }) => {
  if (!isSignedIn(locals) || !enableNotification) {
    throw redirect(307, "/");
  }
}) satisfies LayoutServerLoad;
