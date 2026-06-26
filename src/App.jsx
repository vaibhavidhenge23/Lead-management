import { useMemo, useState } from "react";
import LeadForm from "./components/LeadForm";
import FilterBar from "./components/FilterBar";
import LeadTable from "./components/LeadTable";
import ViewModal from "./components/ViewModal";
import "./App.css";

const emptyFilters = {
  search: "",
  country: "",
  state: "",
  city: "",
  leadSource: "",
  status: "",
  priority: "",
};

let nextId = 1;

export default function App() {
  // Leads live only in React state, per the task rules — nothing is
  // persisted, so a refresh clears the table back to empty.
  const [leads, setLeads] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [viewingLead, setViewingLead] = useState(null);

  function handleAddLead(lead) {
    setLeads((prev) => [...prev, { ...lead, id: nextId++ }]);
  }

  function handleDeleteLead(id) {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }

  function handleFilterChange(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }

  function handleClearFilters() {
    setFilters(emptyFilters);
  }

  const filteredLeads = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return leads.filter((lead) => {
      if (search) {
        const matchesSearch =
          lead.leadName.toLowerCase().includes(search) || lead.mobile.includes(search);
        if (!matchesSearch) return false;
      }
      if (filters.country && lead.country !== filters.country) return false;
      if (filters.state && lead.state !== filters.state) return false;
      if (filters.city && lead.city !== filters.city) return false;
      if (filters.leadSource && lead.leadSource !== filters.leadSource) return false;
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.priority && lead.priority !== filters.priority) return false;
      return true;
    });
  }, [leads, filters]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Lead Management Portal</h1>
        <p>Add leads, track follow-ups, and filter the list below.</p>
      </header>

      <LeadForm onAddLead={handleAddLead} />

      <section className="leads-section">
        <div className="leads-section-header">
          <h2>Leads ({filteredLeads.length})</h2>
        </div>

        <FilterBar
          leads={leads}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        <LeadTable
          leads={filteredLeads}
          onView={setViewingLead}
          onDelete={handleDeleteLead}
        />
      </section>

      <ViewModal lead={viewingLead} onClose={() => setViewingLead(null)} />
    </div>
  );
}
