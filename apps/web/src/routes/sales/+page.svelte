<div class="eyebrow">Home / Sales</div>

<section aria-labelledby="demo-heading">
  <h1 id="demo-heading">Request a demo from Enclave</h1>
  <p>Fields marked with * are required.</p>

    <form action="/demo-requests" method="post">
    <div class="form-field">
      <label for="full-name">Full name *</label>
      <input
        type="text"
        id="full-name"
        name="fullName"
        autocomplete="name"
        required
      />
    </div>

    <div class="form-field">
      <label for="email">School or work email *</label>
      <input
        type="email"
        id="email"
        name="email"
        autocomplete="email"
        required
      />
    </div>

    <div class="form-field">
      <label for="institution">School or institution name *</label>
      <input
        type="text"
        id="institution"
        name="institution"
        autocomplete="organization"
        required
      />
    </div>

    <div class="form-field">
      <label for="role">Your role *</label>
      <select id="role" name="role" required>
        <option value="" disabled selected>Select your role</option>
        <option value="instructor">Teacher or professor</option>
        <option value="department-head">Department head</option>
        <option value="administrator">School administrator</option>
        <option value="it">IT staff</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-field">
      <label for="institution-type">Institution type *</label>
      <select id="institution-type" name="institutionType" required>
        <option value="" disabled selected>Select institution type</option>
        <option value="high-school">High school</option>
        <option value="higher-education">College or university</option>
        <option value="school-district">School district</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div class="form-field">
      <label for="student-count">Estimated students who would use it *</label>
      <p id="student-count-help">
        Estimate for your class, department, or planned rollout.
      </p>
      <select
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

    <div class="form-field">
      <label for="demo-goals">
        What would you like to explore in the demo? (optional)
      </label>
      <textarea
        id="demo-goals"
        name="demoGoals"
        rows="4"
        maxlength="2000"
        placeholder="Tell us about your subjects, programming languages, or exam needs."
      ></textarea>
    </div>

    <p>
      We’ll use these details to respond to your request.
      Read our <a href="/privacy">Privacy Policy</a>.
    </p>

    <button type="submit">Request a demo</button>
  </form>

</section>