<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import type { Course, Assignment } from '@enclave/contracts';
  let courses = $state<Course[]>([]), assignments = $state<Assignment[]>([]);
  let code = $state(''), name = $state(''), courseId = $state(''), title = $state('');
  let durationMinutes = $state(60), language = $state('python');
  let error = $state(''), busy = $state(false), loading = $state(true);
  async function refresh() {
    [courses, assignments] = await Promise.all([api.courses(), api.assignments()]);
    if (!courseId) courseId = courses[0]?.id ?? '';
  }
  onMount(() => { refresh().catch(e => error = `Could not load workspace: ${e.message}. Start the API on port 5080.`).finally(() => loading = false); });
  async function save(kind: 'course' | 'assignment') {
    busy = true; error = '';
    try {
      if (kind === 'course') { await api.createCourse({code, name}); code = ''; name = ''; }
      else { await api.createAssignment({courseId, title, durationMinutes, language}); title = ''; }
      await refresh();
    } catch (e) { error = e instanceof Error ? e.message : 'Could not save'; }
    finally { busy = false; }
  }
</script>
<div class="eyebrow">Professor workspace / development demo</div><h1>Classes & assignments</h1>
<p class="notice">Demo endpoints are available only in Development. Changes disappear when the API restarts.</p>
{#if error}<p class="error" role="alert">{error}</p>{/if}
{#if loading}<p role="status">Loading workspace…</p>{/if}
<div class="grid">
<form class="card" onsubmit={e => {e.preventDefault(); save('course');}}><h2>Create a class</h2><label>Course code<input bind:value={code} required maxlength="30" placeholder="CS 201" /></label><label>Class name<input bind:value={name} required maxlength="120" placeholder="Data structures" /></label><button disabled={busy}>Create class</button></form>
<form class="card" onsubmit={e => {e.preventDefault(); save('assignment');}}><h2>Draft an assignment</h2><label>Class<select bind:value={courseId} required><option value="" disabled>Select a class</option>{#each courses as course}<option value={course.id}>{course.code} — {course.name}</option>{/each}</select></label><label>Title<input bind:value={title} required maxlength="160" /></label><label>Duration (minutes)<input type="number" bind:value={durationMinutes} min="5" max="480" required /></label><label>Language<select bind:value={language}><option value="python">Python</option><option value="javascript">JavaScript</option><option value="csharp">C#</option><option value="java">Java</option></select></label><button disabled={busy || !courseId}>Create draft</button></form>
</div>
<h2>Your classes</h2><div class="grid">{#each courses as course}<section class="card"><div class="eyebrow">{course.code}</div><h2>{course.name}</h2><ul>{#each assignments.filter(a => a.courseId === course.id) as assignment}<li>{assignment.title} · {assignment.durationMinutes} min · {assignment.language}</li>{:else}<li>No assignments yet.</li>{/each}</ul></section>{:else}{#if !loading}<p>No classes loaded. Create your first class above.</p>{/if}{/each}</div>
