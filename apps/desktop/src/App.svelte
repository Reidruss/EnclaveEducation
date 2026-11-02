<script lang="ts">
  import { EnclaveApi, type Assignment } from '@enclave/contracts';
  const api = new EnclaveApi(import.meta.env.VITE_API_URL || 'http://localhost:5080');
  let assignments = $state<Assignment[]>([]), selected = $state(''), code = $state('# Your exam workspace\n');
  let status = $state('Connect to load assignment drafts from the development API.');
  let busy = $state(false);
  async function connect() {
    busy = true;
    try { assignments = await api.assignments(); status = assignments.length ? 'Drafts loaded. Exam sessions are not implemented.' : 'Connected. Create an assignment in the web app first.'; }
    catch (e) { status = e instanceof Error ? e.message : 'Connection failed'; }
    finally { busy = false; }
  }
</script>
<main><header><strong>▣ Enclave Education</strong><span>Desktop / Development preview</span></header><div class="workspace"><aside><p class="eyebrow">Exam workspace</p><h1>Ready to focus.</h1><p>Assigned coding exams will appear here when exam delivery is connected.</p><button onclick={connect} disabled={busy}>{busy ? 'Connecting…' : 'Connect to demo API'}</button><p role="status">{status}</p><label>Assignment draft<select bind:value={selected}><option value="">Select a draft</option>{#each assignments as a}<option value={a.id}>{a.title} · {a.durationMinutes} min</option>{/each}</select></label><p class="notice">Preview only. No lockdown controls are active. Code is not saved or submitted.</p></aside><section><div class="editor-title">Scratch editor <span>Local preview · unsaved</span></div><label class="sr-only" for="code">Code editor</label><textarea id="code" bind:value={code} spellcheck="false"></textarea><footer><span>Execution and submission will be connected in a future milestone.</span><button disabled>Submit exam</button></footer></section></div></main>
<style>
:global(body){margin:0;background:#101e1c;color:#e4eee7;font-family:system-ui,sans-serif}:global(*){box-sizing:border-box}header{padding:24px 30px;border-bottom:1px solid #30433c;display:flex;justify-content:space-between;gap:20px}header span,p,footer{color:#a6bdb0}.workspace{display:grid;grid-template-columns:320px 1fr;min-height:calc(100vh - 75px)}aside{padding:30px;border-right:1px solid #30433c}h1{font-size:32px}p{font-size:14px;line-height:1.65}.eyebrow{color:#b5d791;text-transform:uppercase;letter-spacing:.1em;font-size:11px}button{padding:12px 16px;border:0;border-radius:6px;background:#c2dd9a;color:#18352e;font-weight:600;cursor:pointer}button:disabled{opacity:.5;cursor:not-allowed}select{width:100%;padding:10px;margin-top:10px;background:#20352b;color:white;border:1px solid #607569;border-radius:5px}label{font-size:13px}.notice{padding:14px;border:1px solid #60734f;border-radius:6px}section{padding:28px;min-width:0}.editor-title,footer{display:flex;justify-content:space-between;align-items:center;gap:18px;font-size:12px;padding:16px 0}.editor-title span{color:#a6bdb0}textarea{width:100%;height:60vh;resize:vertical;background:#132521;color:#d4e9ba;border:1px solid #304a3d;border-radius:8px;padding:22px;font:14px/1.8 monospace}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}@media(max-width:700px){.workspace{grid-template-columns:1fr}header{flex-direction:column}}
</style>
