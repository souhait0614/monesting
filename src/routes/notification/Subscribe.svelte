<script lang="ts">
  import Button from "@smui/button";
  import { createMutation } from "@tanstack/svelte-query";
  import { subscribe } from "$lib/notification";

  $: subscribeMutation = createMutation({
    mutationFn: subscribe,
  });
</script>

<div class="container">
  <Button variant="raised" disabled={$subscribeMutation.isLoading} on:click={() => $subscribeMutation.mutate()}
    >プッシュ通知を有効にする</Button
  >
</div>

<style lang="scss">
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
