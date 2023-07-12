<script lang="ts">
  import IconButton from "@smui/icon-button";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";

  export let topAppBar: TopAppBar;
</script>

<TopAppBar bind:this={topAppBar} variant="fixed" color="secondary">
  <Row>
    <Section>
      <IconButton
        class="material-icons"
        on:click={() => {
          history.back();
        }}>arrow_back</IconButton
      >
      <Title>テスト</Title>
    </Section>
  </Row>
</TopAppBar>
