<script lang="ts">
  import { initialize, signIn, signOut } from "svelte-google-auth/client";
  import Button from "@smui/button";
  import type { PageData } from "./$types";
  import { invalidateAll } from "$app/navigation";

  export let data: PageData;
  initialize(data, invalidateAll);
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <p>Monesting</p>

  {data.auth.user?.name}
  <Button on:click={() => signIn()}>Sign In</Button>
  <Button on:click={() => signOut()}>Sign Out</Button>
</section>
