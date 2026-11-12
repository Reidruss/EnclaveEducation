<script lang="ts">
  import { onMount } from 'svelte';
  import { ApiError, EnclaveApi, type StudentEnrollment } from '@enclave/contracts';
  import Login from './Login.svelte';
  import { enrollStudent, restoreEnrollment, SessionStorageError } from './enrollment';

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5080';
  const api = new EnclaveApi(apiUrl);
  const storageKey = `enclave.student-session:${apiUrl}`;
  let enrollment = $state<StudentEnrollment | null>(null);
  let checking = $state(true);
  let busy = $state(false);
  let error = $state('');
  let startupError = $state('');

  async function restore() {
    checking = true;
    startupError = '';
    try {
      enrollment = await restoreEnrollment(api, localStorage, storageKey);
    } catch {
      startupError = 'We could not check your enrollment. Check your connection and try again.';
    } finally {
      checking = false;
    }
  }

  async function joinClass(code: string) {
    if (busy) return;
    busy = true;
    error = '';
    try {
      enrollment = await enrollStudent(api, localStorage, storageKey, code);
    } catch (cause) {
      error =
        cause instanceof ApiError || cause instanceof SessionStorageError
          ? cause.message
          : 'We could not reach your class. Check your connection and try again.';
    } finally {
      busy = false;
    }
  }

  function switchStudent() {
    try {
      localStorage.removeItem(storageKey);
      enrollment = null;
      error = '';
    } catch {
      error = 'Unable to clear the saved student. Please try again.';
    }
  }
  onMount(() => {
    void restore();
  });
</script>

<main class="flex min-h-screen flex-col">
  <header
    class="flex flex-wrap items-center justify-between gap-4 border-b border-divider px-8 py-6"
  >
    <strong class="text-base tracking-tight">
      <span class="mr-2 text-accent" aria-hidden="true">▣</span>
      Enclave Education
    </strong>
    <span class="text-xs text-muted">Student desktop</span>
  </header>
  <div class="flex flex-1 items-center justify-center px-6 py-12">
    {#if checking}
      <p class="text-sm text-muted" role="status">Checking your enrollment…</p>
    {:else if startupError}
      <section
        class="w-full max-w-[440px] rounded-2xl border border-divider bg-editor p-8 text-center"
      >
        <h1 class="text-2xl">Let’s reconnect</h1>
        <p class="text-sm leading-relaxed text-muted" role="alert">{startupError}</p>
        <button
          class="mt-4 cursor-pointer rounded-lg border-0 bg-accent px-5 py-3 font-semibold text-accent-ink"
          onclick={restore}
        >
          Try again
        </button>
      </section>
    {:else if enrollment}
      <section class="w-full max-w-[640px] rounded-2xl border border-divider bg-editor p-8 sm:p-10">
        <p class="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Your classroom
        </p>
        <h1 class="mb-3 mt-4 text-3xl font-semibold">Welcome, {enrollment.studentName}.</h1>
        <p class="text-lg">{enrollment.course.code} · {enrollment.course.name}</p>
        <p class="text-sm leading-relaxed text-muted">
          You’re signed in to your class. Your assignments will appear here when exam delivery is
          connected.
        </p>
        <p class="text-xs text-muted">
          Enrolled through {new Date(enrollment.expiresAt).toLocaleDateString()}.
        </p>
        {#if error}<p role="alert">{error}</p>{/if}
        <button
          class="mt-6 cursor-pointer rounded-lg border border-divider bg-canvas px-4 py-3 text-sm text-ink hover:border-accent focus-visible:outline-accent"
          onclick={switchStudent}
        >
          Use a different student code
        </button>
      </section>
    {:else}
      <Login onsubmit={joinClass} {busy} {error} />
    {/if}
  </div>
  <footer class="px-6 pb-6 text-center text-xs text-muted">A focused space for your class.</footer>
</main>
