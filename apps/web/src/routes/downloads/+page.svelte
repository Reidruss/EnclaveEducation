<div class="text-[12px] font-bold uppercase tracking-[0.15em] text-eyebrow">Enclave desktop</div>

<h1
  class="mt-[18px] mb-6 max-w-[820px] text-[clamp(32px,5vw,62px)] leading-[1.08] tracking-[-0.045em]"
>
  A dedicated space for coding exams.
</h1>
<p class="max-w-[720px] leading-[1.65]">
  Students will use the desktop application to access assigned exams and submit their work.
</p>
<p class="max-w-[720px] leading-[1.65]">
  The desktop application is available for the following platforms:
</p>

<div class="my-8 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-[22px]">
  {#each ['Windows', 'macOS', 'Linux'] as platform}
    <section class="rounded-[14px] border border-divider bg-white p-[26px]">
      <h2 class="text-[24px]">{platform}</h2>
      <p class="max-w-[720px] leading-[1.65]">Signed installer coming soon.</p>
      <p class="max-w-[720px] leading-[1.65]">The {platform} installer will be available soon.</p>
      <button
        class="
          inline-block cursor-pointer rounded-[7px] border-0 bg-brand px-[18px] py-3 text-white
          no-underline [font:inherit] disabled:cursor-not-allowed disabled:opacity-50
        "
        disabled
      >
        Not yet available
      </button>
    </section>
  {/each}
</div>

<p
  class="
    max-w-[720px] leading-[1.65] border-l-[3px] border-notice-border bg-notice px-[18px]
    py-[14px]
  "
>
  Developers can run the Tauri client from this repository. Release installers and platform lockdown
  controls are not implemented.
</p>
