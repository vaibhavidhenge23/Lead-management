export default function LeadTable({ leads, onView, onDelete }) {
  if (leads.length === 0) {
    return <div className="empty-state">No leads match the current search/filters.</div>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Name</th>
            <th>Mobile</th>
            <th>City</th>
            <th>State</th>
            <th>Source</th>
            <th>Project</th>
            <th>Budget</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Follow-up Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, index) => (
            <tr key={lead.id}>
              <td>{index + 1}</td>
              <td>{lead.leadName}</td>
              <td>{lead.mobile}</td>
              <td>{lead.city}</td>
              <td>{lead.state}</td>
              <td>{lead.leadSource}</td>
              <td>{lead.project}</td>
              <td>₹{Number(lead.budget).toLocaleString("en-IN")}</td>
              <td>
                <span className={`badge priority-${lead.priority.toLowerCase()}`}>
                  {lead.priority}
                </span>
              </td>
              <td>
                <span className={`badge status-${lead.status.toLowerCase().replace(/\s+/g, "-")}`}>
                  {lead.status}
                </span>
              </td>
              <td>{lead.followUpDate || "—"}</td>
              <td className="action-cell">
                <button type="button" className="btn-view" onClick={() => onView(lead)}>
                  View
                </button>
                <button type="button" className="btn-delete" onClick={() => onDelete(lead.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
