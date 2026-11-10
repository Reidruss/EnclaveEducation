<script lang="ts">
  import '../app.css';
  let { children, data } = $props();
</script>
<svelte:head>
  <title>Enclave Education</title>
  <meta name="description" content="A foundation for trusted coding exams." />
</svelte:head>
<header>
  <a class="brand" href="/">▣ Enclave 
    <span>Education</span>
  </a>
  <nav aria-label="Main navigation">
    <a href="/downloads">Downloads</a>
    <a href="/sales">Request a demo</a>
    {#if data.signedIn}
      <a href="/account">My account</a>
    {:else}
      <a href="/login">Sign in</a>
    {/if}
  </nav>
</header>
<main>{@render children()}</main>
<footer>Enclave Education · Development skeleton · Exam security is not implemented.</footer>
