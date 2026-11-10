<div class="text-[12px] font-bold uppercase tracking-[0.15em] text-eyebrow">Home / Sales</div>

<section aria-labelledby="demo-heading">
  <h1
    class="mt-[18px] mb-6 max-w-[820px] text-[clamp(32px,5vw,62px)] leading-[1.08] tracking-[-0.045em]"
    id="demo-heading"
  >
    Request a demo from Enclave
  </h1>
  <p class="max-w-[720px] leading-[1.65]">Fields marked with * are required.</p>

  <form action="/demo-requests" method="post">
    <div>
      <label class="my-4 block text-[14px]" for="full-name">Full name *</label>
      <input
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        type="text"
        id="full-name"
        name="fullName"
        autocomplete="name"
        required
      />
    </div>

    <div>
      <label class="my-4 block text-[14px]" for="email">School or work email *</label>
      <input
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        type="email"
        id="email"
        name="email"
        autocomplete="email"
        required
      />
    </div>

    <div>
      <label class="my-4 block text-[14px]" for="institution">School or institution name *</label>
      <input
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        type="text"
        id="institution"
        name="institution"
        autocomplete="organization"
        required
      />
    </div>

    <div>
      <label class="my-4 block text-[14px]" for="role">Your role *</label>
      <select
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        id="role"
        name="role"
        required
      >
        <option value="" disabled selected>Select your role</option>
        <option value="instructor">Teacher or professor</option>
        <option value="department-head">Department head</option>
        <option value="administrator">School administrator</option>
        <option value="it">IT staff</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div>
      <label class="my-4 block text-[14px]" for="institution-type">Institution type *</label>
      <select
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        id="institution-type"
        name="institutionType"
        required
      >
        <option value="" disabled selected>Select institution type</option>
        <option value="high-school">High school</option>
        <option value="higher-education">College or university</option>
        <option value="school-district">School district</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div>
      <label class="my-4 block text-[14px]" for="student-count">
        Estimated students who would use it *
      </label>
      <p class="max-w-[720px] leading-[1.65]" id="student-count-help">
        Estimate for your class, department, or planned rollout.
      </p>
      <select
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        id="student-count"
        name="studentCount"
        aria-describedby="student-count-help"
        required
      >
        <option value="" disabled selected>Select a range</option>
        <option value="under-50">Under 50</option>
        <option value="50-199">50-199</option>
        <option value="200-999">200-999</option>
        <option value="1000-plus">1,000+</option>
        <option value="unsure">Unsure</option>
      </select>
    </div>

    <div>
      <label class="my-4 block text-[14px]" for="demo-goals">
        What would you like to explore in the demo? (optional)
      </label>
      <textarea
        class="mt-[7px] block w-full rounded-md border border-input-border bg-white p-[11px] [font:inherit]"
        id="demo-goals"
        name="demoGoals"
        rows="4"
        maxlength="2000"
        placeholder="Tell us about your subjects, programming languages, or exam needs."></textarea>
    </div>

    <p class="max-w-[720px] leading-[1.65]">
      We’ll use these details to respond to your request. Read our <a
        class="text-link underline-offset-4"
        href="/privacy"
      >
        Privacy Policy
      </a>
      .
    </p>

    <button
      class="
        inline-block cursor-pointer rounded-[7px] border-0 bg-brand px-[18px] py-3 text-white
        no-underline [font:inherit] disabled:cursor-not-allowed disabled:opacity-50
      "
      type="submit"
    >
      Request a demo
    </button>
  </form>
</section>
