
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageProps } from './$types';

  let { data, form }: PageProps = $props();
  let showPassword = $state(false);
  let password = $state('');
  let busy = $state(false);
</script>

<svelte:head>
  <title>Sign in · Enclave Education</title>
  <meta name="description" content="Sign in to your Enclave Education workspace." />
</svelte:head>

<div class="login-shell">
  <section class="intro" aria-labelledby="intro-title">
    <div class="intro-top"><span class="symbol" aria-hidden="true">▣</span> A little focus. A lot of possibility.</div>
    <div class="intro-content">
      <div class="intro-eyebrow">YOUR NEXT CHAPTER STARTS HERE</div>
      <h1 id="intro-title">Room to learn.<br />Space to grow.</h1>
      <p>Bring your classes, coding assignments, and next big ideas together in one place.</p>
      <div class="workspace-preview" aria-hidden="true">
        <div class="preview-heading"><span class="preview-icon">&lt;/&gt;</span><span>Your learning workspace<small>A little progress, every day.</small></span><span class="preview-dots">•••</span></div>
        <div class="preview-line"><span class="check">✓</span><span>Build your understanding</span><span class="line-number">01</span></div>
        <div class="preview-line"><span class="check">✓</span><span>Put ideas into practice</span><span class="line-number">02</span></div>
        <div class="preview-line"><span class="empty-check"></span><span>See what you can do</span><span class="line-number">03</span></div>
      </div>
    </div>
    <div class="intro-bottom"><span class="status-dot"></span> Built for curious minds.</div>
  </section>

  <section class="form-panel" aria-labelledby="login-title">
    <div class="form-heading">
      <div class="eyebrow">YOUR ENCLAVE WORKSPACE</div>
      <h2 id="login-title">Welcome back.</h2>
      <p>A fresh start, right where you left off.</p>
    </div>

    <form method="POST" use:enhance={() => {
      busy = true;
      return async ({ update }) => {
        try { await update(); }
        finally { busy = false; password = ''; }
      };
    }} aria-busy={busy}>
      <label for="email">Email address</label>
      <input id="email" name="email" type="email" autocomplete="username" placeholder="you@university.edu" required />

      <label for="password">Password</label>
      <div class="password-field">
        <input id="password" name="password" type={showPassword ? 'text' : 'password'} bind:value={password} autocomplete="current-password" placeholder="Enter your password" required />
        <button class="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onclick={() => showPassword = !showPassword}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" />{#if showPassword}<path d="m3 3 18 18" />{/if}</svg>
        </button>
      </div>

      <p class="prototype-note">{data.configured ? 'Use the account provided by your institution.' : 'Sign-in is awaiting configuration.'}</p>
      <button class="sign-in" type="submit" disabled={busy || !data.configured}>{busy ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></button>
      <div class="feedback" role="status">{form?.message ?? ''}</div>
    </form>

    <div class="demo-link"><span>Teaching with Enclave?</span><span>Sign in with an instructor account to access classes and assignments.</span></div>
    <p class="help">Need access for your institution? <a href="/sales">Request a demo</a></p>
    <a class="privacy" href="/privacy">Privacy policy</a>
  </section>
</div>

<style>
  .login-shell { display: grid; grid-template-columns: 1fr 1fr; overflow: hidden; border: 1px solid #d9e2d8; border-radius: 20px; background: #fff; box-shadow: 0 18px 55px #18352e08; }
  .intro { display: flex; flex-direction: column; justify-content: space-between; padding: 36px; color: #f5f7f3; background: #204e3c; position: relative; overflow: hidden; }
  .intro::after { content: ''; position: absolute; width: 400px; height: 400px; border: 1px solid #ffffff0b; border-radius: 50%; bottom: -280px; left: -120px; box-shadow: 0 0 0 45px #ffffff03, 0 0 0 90px #ffffff03; pointer-events: none; }
  .intro-top { display: flex; align-items: center; gap: 10px; font-size: 11px; color: #d4e2d3; }
  .symbol { font-size: 25px; color: #c9dca4; }
  .intro-content { padding: 55px 0 40px; }
  .intro-eyebrow { font-size: 9px; font-weight: 600; letter-spacing: .16em; color: #c9dca4; }
  h1 { font-size: clamp(32px, 3.5vw, 44px); line-height: 1.16; letter-spacing: -.045em; margin: 17px 0; }
  .intro-content > p { color: #d4e2d3; font-size: 13px; max-width: 320px; line-height: 1.8; }
  .workspace-preview { margin-top: 32px; padding: 20px; border: 1px solid #ffffff24; border-radius: 12px; background: #ffffff09; transform: rotate(-2deg); }
  .preview-heading { display: flex; gap: 11px; align-items: center; font-size: 11px; padding-bottom: 17px; border-bottom: 1px solid #ffffff18; }
  .preview-icon { display: grid; place-items: center; width: 35px; height: 35px; border-radius: 9px; background: #c9dca4; color: #204e3c; font-weight: 600; font-size: 14px; }
  .preview-heading small { display: block; color: #b1c6b9; font-size: 9px; margin-top: 3px; }
  .preview-dots { margin-left: auto; letter-spacing: 2px; color: #b1c6b9; }
  .preview-line { display: flex; align-items: center; gap: 11px; margin-top: 17px; font-size: 10px; color: #d4e2d3; }
  .check, .empty-check { display: inline-grid; place-items: center; width: 17px; height: 17px; border-radius: 50%; border: 1px solid #c9dca45e; color: #c9dca4; }
  .check { background: #c9dca419; }
  .line-number { margin-left: auto; font-size: 9px; color: #b1c6b9; }
  .intro-bottom { display: flex; align-items: center; gap: 8px; font-size: 10px; color: #c5d5c8; }
  .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #c9dca4; }
  .form-panel { padding: 55px 42px 30px; }
  .form-heading .eyebrow { font-size: 9px; letter-spacing: .13em; }
  h2 { font-size: 31px; letter-spacing: -.045em; margin: 12px 0 8px; line-height: 1.2; }
  .form-heading p { font-size: 12px; color: #617367; margin-bottom: 29px; }
  label { font-size: 12px; font-weight: 500; margin: 19px 0 8px; }
  input { margin: 0; padding: 13px 14px; font-size: 12px; border-color: #d5dfd5; border-radius: 8px; background: #fcfdfa; }
  input::placeholder { color: #87938b; }
  .password-field { position: relative; }
  .password-field input { padding-right: 48px; }
  .password-toggle { position: absolute; right: 3px; top: 3px; width: 40px; height: 40px; display: grid; place-items: center; padding: 0; color: #617367; background: transparent; }
  .password-toggle:hover { color: #204e3c; background: #e8efdc; }
  .prototype-note { font-size: 10px; color: #617367; margin: 14px 0 19px; }
  .sign-in { display: flex; width: 100%; justify-content: center; align-items: center; gap: 13px; font-size: 12px; font-weight: 500; padding: 14px 18px; border-radius: 8px; transition: background .15s; }
  .sign-in:hover { background: #183e2d; }
  .sign-in span { font-size: 18px; line-height: 1; }
  .feedback { font-size: 11px; line-height: 1.7; color: #216549; }
  .feedback:not(:empty) { padding: 13px; margin-top: 14px; background: #f0f5e9; border-radius: 8px; }
  .demo-link { display: flex; flex-direction: column; text-align: center; gap: 6px; padding: 23px 0; margin-top: 24px; border-top: 1px solid #e5ebe1; border-bottom: 1px solid #e5ebe1; font-size: 11px; }
  .demo-link > span { color: #617367; }
  .help { font-size: 10px; text-align: center; color: #617367; margin: 22px 0 16px; }
  .help a { white-space: nowrap; }
  .privacy { display: block; text-align: center; font-size: 10px; color: #617367; }
  @media (max-width: 850px) { .intro { padding: 28px; } .form-panel { padding: 42px 28px 28px; } }
  @media (max-width: 620px) { .login-shell { grid-template-columns: 1fr; } .intro { padding: 25px; } .intro-content { padding: 25px 0 5px; } .intro-content > p { max-width: none; } .intro-bottom, .workspace-preview { display: none; } h1 { font-size: 35px; } .form-panel { padding: 32px 25px; } }
</style>
