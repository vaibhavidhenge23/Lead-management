export default function ViewModal({ lead, onClose }) {
  if (!lead) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Lead Details</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <DetailRow label="Lead Name" value={lead.leadName} />
          <DetailRow label="Mobile Number" value={lead.mobile} />
          <DetailRow label="Email" value={lead.email || "—"} />
          <DetailRow label="Country" value={lead.country} />
          <DetailRow label="State" value={lead.state} />
          <DetailRow label="City" value={lead.city} />
          <DetailRow label="Lead Source" value={lead.leadSource} />
          <DetailRow label="Project / Requirement" value={lead.project} />
          <DetailRow label="Budget" value={`₹${Number(lead.budget).toLocaleString("en-IN")}`} />
          <DetailRow label="Priority" value={lead.priority} />
          <DetailRow label="Status" value={lead.status} />
          <DetailRow label="Follow-up Date" value={lead.followUpDate || "—"} />
          <DetailRow label="Remark" value={lead.remark || "—"} />
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}
