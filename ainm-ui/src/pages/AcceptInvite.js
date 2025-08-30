import React, { useEffect, useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";

export default function AcceptInvite() {
  const { inviteCode } = useParams();
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!user) {
      navigate(`/register?inviteCode=${inviteCode}`);
      return;
    }
    async function accept() {
      try {
        // Get JWT token from localStorage
        const token = localStorage.getItem("jwt");
        await axios.post(
          `${apiUrl}/api/partner/link`,
          { inviteCode },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setMsg("Partner linked! Redirecting...");
        setTimeout(() => navigate("/swipepage"), 2000);
      } catch (err) {
        setMsg("Invalid or expired invite.");
      }
    }
    accept();
  }, [inviteCode, user, navigate, apiUrl]);

  return <div>{msg}</div>;
}