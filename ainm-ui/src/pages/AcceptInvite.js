import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AcceptInvite() {
  const { inviteCode } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function accept() {
      try {
        await axios.post("http://localhost:5233/api/partner/link", { inviteCode }, { withCredentials: true });
        setMsg("Partner linked! Redirecting...");
        setTimeout(() => navigate("/swipepage"), 2000);
      } catch (err) {
        setMsg("Invalid or expired invite.");
      }
    }
    accept();
  }, [inviteCode, navigate]);

  return <div>{msg}</div>;
}