<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>
<svelte:head><title>Enclave Education</title><meta name="description" content="A foundation for trusted coding exams." /></svelte:head>
<header><a class="brand" href="/">▣ Enclave <span>Education</span></a><nav aria-label="Main navigation"><a href="/classes">Classes & assignments</a><a href="/downloads">Desktop app</a><a href="/signup">Sign up</a></nav></header>
<main>{@render children()}</main>
<footer>Enclave Education · Development skeleton · Exam security is not implemented.</footer>
