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

<div
  class="
    grid grid-cols-2 overflow-hidden rounded-[20px] border border-divider bg-white shadow-login
    max-[620px]:grid-cols-1
  "
>
  <section
    class="
      relative flex flex-col justify-between overflow-hidden bg-intro p-9 text-canvas
      max-[850px]:p-7 max-[620px]:p-[25px] after:pointer-events-none after:absolute
      after:bottom-[-280px] after:left-[-120px] after:size-[400px] after:rounded-full
      after:border after:border-[#ffffff0b] after:shadow-intro-rings after:content-['']
    "
    aria-labelledby="intro-title"
  >
    <div class="flex items-center gap-[10px] text-[11px] text-intro-copy">
      <span class="text-[25px] text-highlight" aria-hidden="true">▣</span>
      A little focus. A lot of possibility.
    </div>
    <div class="pt-[55px] pb-10 max-[620px]:pt-[25px] max-[620px]:pb-[5px]">
      <div class="text-[9px] font-semibold tracking-[0.16em] text-highlight">
        YOUR NEXT CHAPTER STARTS HERE
      </div>
      <h1
        class="
          my-[17px] max-w-[820px] text-[clamp(32px,3.5vw,44px)] leading-[1.16]
          tracking-[-0.045em] max-[620px]:text-[35px]
        "
        id="intro-title"
      >
        Room to learn.
        <br />
        Space to grow.
      </h1>
      <p class="max-w-[320px] text-[13px] leading-[1.8] text-intro-copy max-[620px]:max-w-none">
        Bring your classes, coding assignments, and next big ideas together in one place.
      </p>
      <div
        class="
          mt-8 rotate-[-2deg] rounded-xl border border-[#ffffff24] bg-[#ffffff09] p-5
          max-[620px]:hidden
        "
        aria-hidden="true"
      >
        <div class="flex items-center gap-[11px] border-b border-[#ffffff18] pb-[17px] text-[11px]">
          <span
            class="
              grid size-[35px] place-items-center rounded-[9px] bg-highlight text-[14px]
              font-semibold text-intro
            "
          >
            &lt;/&gt;
          </span>
          <span>
            Your learning workspace
            <small class="mt-[3px] block text-[9px] text-preview-muted">
              A little progress, every day.
            </small>
          </span>
          <span class="ml-auto tracking-[2px] text-preview-muted">•••</span>
        </div>
        <div class="mt-[17px] flex items-center gap-[11px] text-[10px] text-intro-copy">
          <span
            class="
              inline-grid size-[17px] place-items-center rounded-full border border-[#c9dca45e]
              bg-[#c9dca419] text-highlight
            "
          >
            ✓
          </span>
          <span>Build your understanding</span>
          <span class="ml-auto text-[9px] text-preview-muted">01</span>
        </div>
        <div class="mt-[17px] flex items-center gap-[11px] text-[10px] text-intro-copy">
          <span
            class="
              inline-grid size-[17px] place-items-center rounded-full border border-[#c9dca45e]
              bg-[#c9dca419] text-highlight
            "
          >
            ✓
          </span>
          <span>Put ideas into practice</span>
          <span class="ml-auto text-[9px] text-preview-muted">02</span>
        </div>
        <div class="mt-[17px] flex items-center gap-[11px] text-[10px] text-intro-copy">
          <span
            class="
              inline-grid size-[17px] place-items-center rounded-full border border-[#c9dca45e]
              text-highlight
            "
          ></span>
          <span>See what you can do</span>
          <span class="ml-auto text-[9px] text-preview-muted">03</span>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-2 text-[10px] text-[#c5d5c8] max-[620px]:hidden">
      <span class="size-[6px] rounded-full bg-highlight"></span>
      Built for curious minds.
    </div>
  </section>

  <section
    class="
      px-[42px] pt-[55px] pb-[30px] max-[850px]:px-7 max-[850px]:pt-[42px] max-[850px]:pb-7
      max-[620px]:px-[25px] max-[620px]:py-8
    "
    aria-labelledby="login-title"
  >
    <div>
      <div class="text-[9px] font-bold uppercase tracking-[0.13em] text-eyebrow">
        YOUR ENCLAVE WORKSPACE
      </div>
      <h2 class="mt-3 mb-2 text-[31px] leading-[1.2] tracking-[-0.045em]" id="login-title">
        Welcome back.
      </h2>
      <p class="max-w-[720px] leading-[1.65] mb-[29px] text-[12px] text-muted">
        A fresh start, right where you left off.
      </p>
    </div>

    <form
      method="POST"
      use:enhance={() => {
        busy = true;
        return async ({ update }) => {
          try {
            await update();
          } finally {
            busy = false;
            password = '';
          }
        };
      }}
      aria-busy={busy}
    >
      <label class="mt-[19px] mb-2 block text-[12px] font-medium" for="email">Email address</label>
      <input
        class="
          m-0 block w-full rounded-lg border border-[#d5dfd5] bg-[#fcfdfa] px-[14px] py-[13px]
          font-sans text-[12px] placeholder:text-[#87938b]
        "
        id="email"
        name="email"
        type="email"
        autocomplete="username"
        placeholder="you@university.edu"
        required
      />

      <label class="mt-[19px] mb-2 block text-[12px] font-medium" for="password">Password</label>
      <div class="relative">
        <input
          class="
            m-0 block w-full rounded-lg border border-[#d5dfd5] bg-[#fcfdfa] px-[14px] py-[13px]
            font-sans text-[12px] placeholder:text-[#87938b] pr-12
          "
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          bind:value={password}
          autocomplete="current-password"
          placeholder="Enter your password"
          required
        />
        <button
          class="
            cursor-pointer border-0 font-sans disabled:cursor-not-allowed disabled:opacity-50
            absolute top-[3px] right-[3px] grid size-10 place-items-center rounded-[7px]
            bg-transparent p-0 text-muted hover:bg-notice hover:text-intro
          "
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onclick={() => (showPassword = !showPassword)}
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            aria-hidden="true"
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />

            {#if showPassword}
              <path d="m3 3 18 18" />
            {/if}
          </svg>
        </button>
      </div>

      <p class="max-w-[720px] leading-[1.65] mt-[14px] mb-[19px] text-[10px] text-muted">
        {data.configured
          ? 'Use the account provided by your institution.'
          : 'Sign-in is awaiting configuration.'}
      </p>
      <button
        class="
          cursor-pointer border-0 font-sans disabled:cursor-not-allowed disabled:opacity-50 flex
          w-full items-center justify-center gap-[13px] rounded-lg bg-brand px-[18px] py-[14px]
          text-[12px] font-medium text-white transition-[background] duration-150
          hover:bg-[#183e2d]
        "
        type="submit"
        disabled={busy || !data.configured}
      >
        {busy ? 'Signing in…' : 'Sign in'}
        <span class="text-[18px] leading-none" aria-hidden="true">→</span>
      </button>
      <div
        class="
          text-[11px] leading-[1.7] text-link not-empty:mt-[14px] not-empty:rounded-lg
          not-empty:bg-[#f0f5e9] not-empty:p-[13px]
        "
        role="status"
      >
        {form?.message ?? ''}
      </div>
    </form>

    <div
      class="mt-6 flex flex-col gap-[6px] border-y border-[#e5ebe1] py-[23px] text-center text-[11px]"
    >
      <span class="text-muted">Teaching with Enclave?</span>
      <span class="text-muted">
        Sign in with an instructor account to access classes and assignments.
      </span>
    </div>
    <p class="max-w-[720px] leading-[1.65] mt-[22px] mb-4 text-center text-[10px] text-muted">
      Need access for your institution? <a
        class="text-link underline-offset-4 whitespace-nowrap"
        href="/sales"
      >
        Request a demo
      </a>
    </p>
    <a class="underline-offset-4 block text-center text-[10px] text-muted" href="/privacy">
      Privacy policy
    </a>
  </section>
</div>
