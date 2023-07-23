<script lang="ts">
  import Button from "@smui/button";
  import { signIn } from "svelte-google-auth/client";
  import { APP_NAME } from "$lib/const";

  const scope = ["https://www.googleapis.com/auth/drive.appdata", "openid", "profile", "email"];
</script>

<div class="welcome">
  <h1>{APP_NAME}</h1>
  <Button variant="raised" on:click={() => signIn(scope)}>Googleでサインイン</Button>
</div>

<style lang="scss">
  .welcome {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
