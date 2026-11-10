<script lang="ts">
  import { EnclaveApi, type Assignment } from '@enclave/contracts';

  const api = new EnclaveApi(import.meta.env.VITE_API_URL || 'http://localhost:5080');

  let assignments = $state<Assignment[]>([]);
  let selected = $state('');
  let code = $state('# Your exam workspace\n');

  let status = $state('Connect to load assignment drafts from the development API.');

  let busy = $state(false);

  async function connect() {
    busy = true;
    try {
      assignments = await api.assignments();
      status = assignments.length
        ? 'Drafts loaded. Exam sessions are not implemented.'
        : 'Connected. Create an assignment in the web app first.';
    } catch (e) {
      status = e instanceof Error ? e.message : 'Connection failed';
    } finally {
      busy = false;
    }
  }
</script>

<main>
  <header
    class="flex justify-between gap-5 border-b border-divider px-[30px] py-6 max-[700px]:flex-col"
  >
    <strong>▣ Enclave Education</strong>
    <span class="text-muted">Desktop / Development preview</span>
  </header>

  <div class="grid min-h-[calc(100vh-75px)] grid-cols-[320px_1fr] max-[700px]:grid-cols-1">
    <aside class="border-r border-divider p-[30px]">
      <p class="leading-[1.65] text-[11px] uppercase tracking-[0.1em] text-[#b5d791]">
        Exam workspace
      </p>
      <h1 class="text-[32px]">Ready to focus.</h1>
      <p class="text-[14px] leading-[1.65] text-muted">
        Assigned coding exams will appear here when exam delivery is connected.
      </p>
      <button
        class="
          cursor-pointer rounded-md border-0 bg-accent px-4 py-3 font-semibold text-accent-ink
          disabled:cursor-not-allowed disabled:opacity-50
        "
        onclick={connect}
        disabled={busy}
      >
        {busy ? 'Connecting…' : 'Connect to demo API'}
      </button>

      <p class="text-[14px] leading-[1.65] text-muted" role="status">{status}</p>
      <label class="text-[13px]">
        Assignment draft
        <select
          class="mt-[10px] w-full rounded-[5px] border border-[#607569] bg-[#20352b] p-[10px] text-white"
          bind:value={selected}
        >
          <option value="">Select a draft</option>

          {#each assignments as a}
            <option value={a.id}>
              {a.title} · {a.durationMinutes} min
            </option>
          {/each}
        </select>
      </label>
      <p class="text-[14px] leading-[1.65] text-muted rounded-md border border-[#60734f] p-[14px]">
        Preview only. No lockdown controls are active. Code is not saved or submitted.
      </p>
    </aside>
    <section class="min-w-0 p-7">
      <div class="flex items-center justify-between gap-[18px] py-4 text-[12px]">
        Scratch editor <span class="text-muted">Local preview · unsaved</span>
      </div>
      <label class="text-[13px] sr-only" for="code">Code editor</label>
      <textarea
        class="
          h-[60vh] w-full resize-y rounded-lg border border-[#304a3d] bg-editor p-[22px]
          font-mono text-[14px] leading-[1.8] text-code
        "
        id="code"
        bind:value={code}
        spellcheck="false"></textarea>
      <footer class="flex items-center justify-between gap-[18px] py-4 text-[12px] text-muted">
        <span>Execution and submission will be connected in a future milestone.</span>
        <button
          class="
            cursor-pointer rounded-md border-0 bg-accent px-4 py-3 font-semibold text-accent-ink
            disabled:cursor-not-allowed disabled:opacity-50
          "
          disabled
        >
          Submit exam
        </button>
      </footer>
    </section>
  </div>
</main>
