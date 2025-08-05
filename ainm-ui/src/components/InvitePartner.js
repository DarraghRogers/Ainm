import React, { useState } from "react";
import axios from "axios";

export default function InvitePartner() {
  const [email, setEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [msg, setMsg] = useState("");

  const handleEmailInvite = async () => {
    try {
      const res = await axios.post("http://localhost:5233/api/partner/invite", { email }, { withCredentials: true });
      setInviteLink(res.data.link);
      setMsg("Invite sent by email!");
    } catch (err) {
      setMsg("Error sending invite");
    }
  };

  const handleLinkInvite = async () => {
    try {
      const res = await axios.post("http://localhost:5233/api/partner/invite", { email}, { withCredentials: true });
      setInviteLink(res.data.link);
      setMsg("Copy and share this link!");
    } catch (err) {
      setMsg("Error creating invite");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow" style={{ borderRadius: "32px", background: "linear-gradient(135deg, #ffe0ec 0%, #e0f7fa 100%)" }}>
            <h2 className="mb-4 text-center" style={{ color: "#ffb6b9" }}>Invite a Partner</h2>
            <div className="mb-3 d-flex">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Partner's email"
                className="form-control me-2"
                style={{ borderRadius: "16px" }}
              />
              <button className="btn btn-primary" style={{ borderRadius: "16px" }} onClick={handleEmailInvite}>
                Send Email Invite
              </button>
            </div>
            <div className="mb-3 text-center">
              <button className="btn btn-success" style={{ borderRadius: "16px" }} onClick={handleLinkInvite}>
                Generate Shareable Link
              </button>
            </div>
            {inviteLink && (
              <div className="mb-3 d-flex">
                <input
                  value={inviteLink}
                  readOnly
                  className="form-control me-2"
                  style={{ borderRadius: "16px" }}
                />
                <button className="btn btn-info" style={{ borderRadius: "16px" }} onClick={() => navigator.clipboard.writeText(inviteLink)}>
                  Copy Link
                </button>
              </div>
            )}
            {msg && <div className="alert alert-info text-center mt-3" style={{ borderRadius: "16px" }}>{msg}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}