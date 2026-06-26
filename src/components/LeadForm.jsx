import { useState } from "react";
import { Country, State, City } from "country-state-city";
import {
  LEAD_SOURCE_OPTIONS,
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "../data/options";

const emptyForm = {
  leadName: "",
  mobile: "",
  email: "",
  countryIso: "",
  stateIso: "",
  city: "",
  leadSource: "",
  project: "",
  budget: "",
  priority: "",
  status: "",
  followUpDate: "",
  remark: "",
};

// All countries, loaded once. State/city lists depend on what the
// user has picked so far, so those are derived on every render.
const countries = Country.getAllCountries();

function validate(form) {
  const errors = {};

  if (!form.leadName.trim()) errors.leadName = "Lead name is required.";

  if (!form.mobile.trim()) {
    errors.mobile = "Mobile number is required.";
  } else if (!/^\d{10}$/.test(form.mobile.trim())) {
    errors.mobile = "Mobile number must be exactly 10 digits.";
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.countryIso) errors.countryIso = "Country is required.";
  if (!form.stateIso) errors.stateIso = "State is required.";
  if (!form.city) errors.city = "City is required.";
  if (!form.leadSource) errors.leadSource = "Lead source is required.";
  if (!form.project.trim()) errors.project = "Project / requirement is required.";

  if (!form.budget.toString().trim()) {
    errors.budget = "Budget is required.";
  } else if (Number.isNaN(Number(form.budget)) || Number(form.budget) <= 0) {
    errors.budget = "Budget must be a positive number.";
  }

  if (!form.priority) errors.priority = "Priority is required.";
  if (!form.status) errors.status = "Status is required.";

  return errors;
}

export default function LeadForm({ onAddLead }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const states = form.countryIso ? State.getStatesOfCountry(form.countryIso) : [];
  const cities =
    form.countryIso && form.stateIso
      ? City.getCitiesOfState(form.countryIso, form.stateIso)
      : [];

  function updateField(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      // Changing country wipes out the state/city picked under it,
      // since they no longer make sense together.
      if (field === "countryIso") {
        next.stateIso = "";
        next.city = "";
      }
      // Changing state wipes out the city for the same reason.
      if (field === "stateIso") {
        next.city = "";
      }
      return next;
    });

    if (successMsg) setSuccessMsg("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const country = countries.find((c) => c.isoCode === form.countryIso);
    const state = states.find((s) => s.isoCode === form.stateIso);

    onAddLead({
      leadName: form.leadName.trim(),
      mobile: form.mobile.trim(),
      email: form.email.trim(),
      country: country?.name || "",
      state: state?.name || "",
      city: form.city,
      leadSource: form.leadSource,
      project: form.project.trim(),
      budget: Number(form.budget),
      priority: form.priority,
      status: form.status,
      followUpDate: form.followUpDate,
      remark: form.remark.trim(),
    });

    setForm(emptyForm);
    setErrors({});
    setSuccessMsg("Lead added successfully.");
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <h2>Add Lead</h2>

      {successMsg && <div className="success-banner">{successMsg}</div>}

      <div className="form-grid">
        <Field label="Lead Name" error={errors.leadName} required>
          <input
            type="text"
            value={form.leadName}
            onChange={(e) => updateField("leadName", e.target.value)}
            placeholder="Enter lead name"
          />
        </Field>

        <Field label="Mobile Number" error={errors.mobile} required>
          <input
            type="text"
            inputMode="numeric"
            maxLength={10}
            value={form.mobile}
            onChange={(e) => updateField("mobile", e.target.value.replace(/\D/g, ""))}
            placeholder="10 digit number"
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            type="text"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="name@example.com"
          />
        </Field>

        <Field label="Country" error={errors.countryIso} required>
          <select
            value={form.countryIso}
            onChange={(e) => updateField("countryIso", e.target.value)}
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="State" error={errors.stateIso} required>
          <select
            value={form.stateIso}
            onChange={(e) => updateField("stateIso", e.target.value)}
            disabled={!form.countryIso}
          >
            <option value="">
              {form.countryIso ? "Select state" : "Select country first"}
            </option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="City" error={errors.city} required>
          <select
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
            disabled={!form.stateIso}
          >
            <option value="">
              {form.stateIso ? "Select city" : "Select state first"}
            </option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Lead Source" error={errors.leadSource} required>
          <select
            value={form.leadSource}
            onChange={(e) => updateField("leadSource", e.target.value)}
          >
            <option value="">Select source</option>
            {LEAD_SOURCE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Project / Requirement" error={errors.project} required>
          <input
            type="text"
            value={form.project}
            onChange={(e) => updateField("project", e.target.value)}
            placeholder="e.g. 2BHK in Wardha Road"
          />
        </Field>

        <Field label="Budget" error={errors.budget} required>
          <input
            type="number"
            value={form.budget}
            onChange={(e) => updateField("budget", e.target.value)}
            placeholder="Budget in Rs."
            min="0"
          />
        </Field>

        <Field label="Priority" error={errors.priority} required>
          <select
            value={form.priority}
            onChange={(e) => updateField("priority", e.target.value)}
          >
            <option value="">Select priority</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status" error={errors.status} required>
          <select
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
          >
            <option value="">Select status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Follow-up Date" error={errors.followUpDate}>
          <input
            type="date"
            value={form.followUpDate}
            onChange={(e) => updateField("followUpDate", e.target.value)}
          />
        </Field>

        <Field label="Remark" error={errors.remark} fullWidth>
          <textarea
            value={form.remark}
            onChange={(e) => updateField("remark", e.target.value)}
            placeholder="Any extra notes about this lead"
            rows={2}
          />
        </Field>
      </div>

      <button type="submit" className="btn-primary">
        Add Lead
      </button>
    </form>
  );
}

// Small wrapper so every field gets the same label / error layout
// without repeating the markup each time.
function Field({ label, error, required, fullWidth, children }) {
  return (
    <div className={`field ${fullWidth ? "field-full" : ""}`}>
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
}
