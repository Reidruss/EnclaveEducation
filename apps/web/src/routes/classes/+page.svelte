<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import type { Course, Assignment } from '@enclave/contracts';

  let courses = $state<Course[]>([]),
    assignments = $state<Assignment[]>([]);
  let code = $state(''),
    name = $state(''),
    courseId = $state(''),
    title = $state('');
  let durationMinutes = $state(60),
    language = $state('python');
  let error = $state(''),
    busy = $state(false),
    loading = $state(true);

  async function refresh() {
    [courses, assignments] = await Promise.all([api.courses(), api.assignments()]);
    if (!courseId) courseId = courses[0]?.id ?? '';
  }
  onMount(() => {
    refresh()
      .catch((e) => {
        error = `Could not load workspace: ${e.message}. Start the API on port 5080.`;
      })
      .finally(() => (loading = false));
  });

  async function save(kind: 'course' | 'assignment') {
    busy = true;
    error = '';
    try {
      if (kind === 'course') {
        await api.createCourse({ code, name });
        code = '';
        name = '';
      } else {
        await api.createAssignment({ courseId, title, durationMinutes, language });
        title = '';
      }
      await refresh();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Could not save';
    } finally {
      busy = false;
    }
  }
</script>

<div class="text-[12px] font-bold uppercase tracking-[0.15em] text-eyebrow">
  Professor workspace / development demo
</div>
<h1
  class="mt-[18px] mb-6 max-w-[820px] text-[clamp(32px,5vw,62px)] leading-[1.08] tracking-[-0.045em]"
>
  Classes & assignments
</h1>
<p
  class="
    max-w-[720px] leading-[1.65] border-l-[3px] border-notice-border bg-notice px-[18px]
    py-[14px]
  "
>
  Demo endpoints are available only in Development. Changes disappear when the API restarts.
</p>

{#if error}
  <p class="max-w-[720px] leading-[1.65] text-error" role="alert">{error}</p>
{/if}

{#if loading}
  <p class="max-w-[720px] leading-[1.65]" role="status">Loading workspace…</p>
{/if}

<div class="my-8 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[22px]">
  <form
    class="rounded-[14px] border border-divider bg-white p-[26px]"
    onsubmit={(e) => {
      e.preventDefault();
      save('course');
    }}
  >
    <h2 class="text-[24px]">Create a class</h2>
    <label class="my-4 block text-[14px]">
      Course code
      <input
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        bind:value={code}
        required
        maxlength="30"
        placeholder="CS 201"
      />
    </label>
    <label class="my-4 block text-[14px]">
      Class name
      <input
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        bind:value={name}
        required
        maxlength="120"
        placeholder="Data structures"
      />
    </label>
    <button
      class="
        inline-block cursor-pointer rounded-[7px] border-0 bg-brand px-[18px] py-3 text-white
        no-underline [font:inherit] disabled:cursor-not-allowed disabled:opacity-50
      "
      disabled={busy}
    >
      Create class
    </button>
  </form>
  <form
    class="rounded-[14px] border border-divider bg-white p-[26px]"
    onsubmit={(e) => {
      e.preventDefault();
      save('assignment');
    }}
  >
    <h2 class="text-[24px]">Draft an assignment</h2>
    <label class="my-4 block text-[14px]">
      Class
      <select
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        bind:value={courseId}
        required
      >
        <option value="" disabled>Select a class</option>

        {#each courses as course}
          <option value={course.id}>
            {course.code} — {course.name}
          </option>
        {/each}
      </select>
    </label>
    <label class="my-4 block text-[14px]">
      Title
      <input
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        bind:value={title}
        required
        maxlength="160"
      />
    </label>
    <label class="my-4 block text-[14px]">
      Duration (minutes)
      <input
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        type="number"
        bind:value={durationMinutes}
        min="5"
        max="480"
        required
      />
    </label>
    <label class="my-4 block text-[14px]">
      Language
      <select
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        bind:value={language}
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
        <option value="csharp">C#</option>
        <option value="java">Java</option>
      </select>
    </label>
    <button
      class="
        inline-block cursor-pointer rounded-[7px] border-0 bg-brand px-[18px] py-3 text-white
        no-underline [font:inherit] disabled:cursor-not-allowed disabled:opacity-50
      "
      disabled={busy || !courseId}
    >
      Create draft
    </button>
  </form>
</div>
<h2 class="text-[24px]">Your classes</h2>
<div class="my-8 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[22px]">
  {#each courses as course}
    <section class="rounded-[14px] border border-divider bg-white p-[26px]">
      <div class="text-[12px] font-bold uppercase tracking-[0.15em] text-eyebrow">
        {course.code}
      </div>
      <h2 class="text-[24px]">{course.name}</h2>
      <ul class="pl-5">
        {#each assignments.filter((a) => a.courseId === course.id) as assignment}
          <li class="my-[10px]">
            {assignment.title} · {assignment.durationMinutes} min · {assignment.language}
          </li>
        {:else}
          <li class="my-[10px]">No assignments yet.</li>
        {/each}
      </ul>
    </section>
  {:else}
    {#if !loading}
      <p class="max-w-[720px] leading-[1.65]">No classes loaded. Create your first class above.</p>
    {/if}
  {/each}
</div>
