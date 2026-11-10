<script lang="ts">
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
</script>

<svelte:head><title>My account · Enclave Education</title></svelte:head>

<div class="eyebrow">YOUR ENCLAVE ACCOUNT</div>
<h1>You're signed in.</h1>
<p>Welcome to Enclave Education{data.email ? `, ${data.email}` : ''}.</p>
<p class="notice">Your account is connected. The instructor workspace will become available once instructor permissions and protected course access are connected.</p>
<form method="POST" action="?/signout">
  <button type="submit">Sign out</button>
  {#if form?.message}<p class="error" role="alert">{form.message}</p>{/if}
</form>
