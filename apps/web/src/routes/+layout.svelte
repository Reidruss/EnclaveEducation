<script lang="ts">
  import '../app.css';
  let { children, data } = $props();
</script>

<svelte:head>
  <title>Enclave Education</title>
  <meta name="description" content="A foundation for trusted coding exams." />
</svelte:head>
<header
  class="
    mx-auto flex max-w-[1120px] items-center justify-between gap-6 border-b border-divider p-7
    max-[700px]:flex-col max-[700px]:items-start
  "
>
  <a class="text-link text-[23px] font-bold no-underline underline-offset-4" href="/">
    ▣ Enclave
    <span class="font-normal">Education</span>
  </a>
  <nav class="flex flex-wrap gap-[22px]" aria-label="Main navigation">
    <a class="text-link underline-offset-4" href="/downloads">Downloads</a>
    <a class="text-link underline-offset-4" href="/sales">Request a demo</a>

    {#if data.signedIn}
      <a class="text-link underline-offset-4" href="/account">My account</a>
    {:else}
      <a class="text-link underline-offset-4" href="/login">Sign in</a>
    {/if}
  </nav>
</header>
<main class="mx-auto min-h-[75vh] max-w-[1120px] p-7 pt-16 max-[700px]:pt-8">
  {@render children()}
</main>
<footer class="mx-auto max-w-[1120px] p-7 text-muted">
  Enclave Education · Development skeleton · Exam security is not implemented.
</footer>
