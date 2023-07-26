<script lang="ts">
  import IconButton from "@smui/icon-button";
  import TopAppBar, { Section, Title } from "@smui/top-app-bar";

  export let topAppBar: TopAppBar;
  export let title: string;
</script>

<TopAppBar bind:this={topAppBar} variant="fixed" color="secondary">
  <Section>
    <IconButton
      class="material-icons"
      on:click={() => {
        history.back();
      }}>arrow_back</IconButton
    >
    <Title>{title}</Title>
  </Section>
</TopAppBar>
