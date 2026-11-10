<script lang="ts">
  import type { PageProps } from './$types';
  let { data, form }: PageProps = $props();
</script>

<svelte:head><title>My account · Enclave Education</title></svelte:head>

<div class="text-[12px] font-bold uppercase tracking-[0.15em] text-eyebrow">
  YOUR ENCLAVE ACCOUNT
</div>
<h1
  class="mt-[18px] mb-6 max-w-[820px] text-[clamp(32px,5vw,62px)] leading-[1.08] tracking-[-0.045em]"
>
  You're signed in.
</h1>
<p class="max-w-[720px] leading-[1.65]">
  Welcome to Enclave Education{data.email ? `, ${data.email}` : ''}.
</p>
<p
  class="
    max-w-[720px] leading-[1.65] border-l-[3px] border-notice-border bg-notice px-[18px]
    py-[14px]
  "
>
  Your account is connected. The instructor workspace will become available once instructor
  permissions and protected course access are connected.
</p>
<form method="POST" action="?/signout">
  <button
    class="
      inline-block cursor-pointer rounded-[7px] border-0 bg-brand px-[18px] py-3 text-white
      no-underline [font:inherit] disabled:cursor-not-allowed disabled:opacity-50
    "
    type="submit"
  >
    Sign out
  </button>

  {#if form?.message}
    <p class="max-w-[720px] leading-[1.65] text-error" role="alert">{form.message}</p>
  {/if}
</form>
