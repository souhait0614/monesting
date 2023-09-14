<script lang="ts">
  import CircularProgress from "@smui/circular-progress";
</script>

<div class="loading">
  <CircularProgress style="height: 40px; width: 40px;" indeterminate />
</div>

<style lang="scss">
  .loading {
    width: 100%;
    height: 100vh;
    height: 100lvh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
