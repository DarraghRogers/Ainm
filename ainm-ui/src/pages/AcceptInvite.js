import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";

export default function AcceptInvite() {
  const { inviteCode } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      navigate(`/register?inviteCode=${inviteCode}`);
      return;
    }
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
  }, [inviteCode, user, navigate]);

  return <div>{msg}</div>;
}