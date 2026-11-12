<script lang="ts">
  let {
    onsubmit,
    busy,
    error,
  }: {
    onsubmit: (code: string) => Promise<void>;
    busy: boolean;
    error: string;
  } = $props();
  let studentCode = $state('');
</script>

<section
  class="w-full max-w-110 rounded-2xl border border-divider bg-editor p-8 shadow-xl sm:p-10"
  aria-labelledby="login-heading"
>
  <p class="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
    Your class starts here
  </p>
  <h1 id="login-heading" class="mb-3 mt-4 text-3xl font-semibold tracking-tight">
    Enter Student Code
  </h1>
  <p class="mb-7 mt-0 text-sm leading-relaxed text-muted">
    Enter the personalized code from your instructor to join your class.
  </p>
  <form
    onsubmit={(event) => {
      event.preventDefault();
      if (!busy && studentCode.trim()) void onsubmit(studentCode);
    }}
    aria-busy={busy}
  >
    <label for="student-code" class="mb-2 block text-sm font-semibold">Student code</label>
    <input
      id="student-code"
      name="studentCode"
      type="text"
      bind:value={studentCode}
      required
      maxlength="128"
      autocomplete="off"
      autocapitalize="none"
      spellcheck="false"
      placeholder="Enter your code"
      disabled={busy}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? 'code-help code-error' : 'code-help'}
      class="w-full rounded-lg border border-divider bg-canvas px-4 py-3 font-mono text-base text-ink outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:opacity-60"
    />
    <p id="code-help" class="mb-5 mt-3 text-xs leading-relaxed text-muted">
      You only need to enter this once on this device while enrolled in your class.
    </p>
    {#if error}
      <p
        id="code-error"
        class="mb-5 rounded-lg border border-[#b87777] bg-[#3b2424] p-3 text-sm leading-relaxed text-[#ffd4d4]"
        role="alert"
      >
        {error}
      </p>
    {/if}
    <button
      type="submit"
      disabled={busy || !studentCode.trim()}
      class="w-full cursor-pointer rounded-lg border-0 bg-accent px-4 py-3 text-base font-semibold text-accent-ink transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {busy ? 'Joining your class…' : 'Join class'}
    </button>
  </form>
  <p class="mb-0 mt-6 text-center text-xs leading-relaxed text-muted">
    Need a code? Ask your instructor for your personalized student code.
  </p>
</section>
