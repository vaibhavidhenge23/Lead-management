import { useMemo } from "react";
import { LEAD_SOURCE_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from "../data/options";

// Pulls a sorted, de-duplicated list of values for a given field out
// of the current leads — so the filter only ever shows options that
// actually exist in the table.
function uniqueValues(leads, field) {
  return [...new Set(leads.map((lead) => lead[field]).filter(Boolean))].sort();
}

export default function FilterBar({ leads, filters, onFilterChange, onClear }) {
  const countryOptions = useMemo(() => uniqueValues(leads, "country"), [leads]);
  const stateOptions = useMemo(() => uniqueValues(leads, "state"), [leads]);
  const cityOptions = useMemo(() => uniqueValues(leads, "city"), [leads]);

  const hasActiveFilters =
    filters.search ||
    filters.country ||
    filters.state ||
    filters.city ||
    filters.leadSource ||
    filters.status ||
    filters.priority;

  return (
    <div className="filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search by lead name or mobile number"
        value={filters.search}
        onChange={(e) => onFilterChange("search", e.target.value)}
      />

      <select value={filters.country} onChange={(e) => onFilterChange("country", e.target.value)}>
        <option value="">All Countries</option>
        {countryOptions.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select value={filters.state} onChange={(e) => onFilterChange("state", e.target.value)}>
        <option value="">All States</option>
        {stateOptions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={filters.city} onChange={(e) => onFilterChange("city", e.target.value)}>
        <option value="">All Cities</option>
        {cityOptions.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <select value={filters.leadSource} onChange={(e) => onFilterChange("leadSource", e.target.value)}>
        <option value="">All Sources</option>
        {LEAD_SOURCE_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={filters.status} onChange={(e) => onFilterChange("status", e.target.value)}>
        <option value="">All Status</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={filters.priority} onChange={(e) => onFilterChange("priority", e.target.value)}>
        <option value="">All Priority</option>
        {PRIORITY_OPTIONS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button type="button" className="btn-clear" onClick={onClear}>
          Clear Filters
        </button>
      )}
    </div>
  );
}
