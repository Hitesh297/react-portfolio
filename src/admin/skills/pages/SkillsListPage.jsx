import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../../../config/api";
import "./SkillsListPage.css"



export default function SkillsListPage() {
  const location = useLocation();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const flashMessage = location.state?.message || "";

  async function loadSkills() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/skill`);
      if (!res.ok) throw new Error(`Failed to load skills (${res.status})`);
      const data = await res.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load skills");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSkills();
  }, []);

  async function handleDelete(id) {
    const ok = window.confirm("Are you sure you want to delete this skill?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      await loadSkills();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  }

  return (
    <section className="w3-padding">
      {flashMessage ? (
        <div className="alert-strip">
          <div className="alert-msg">{flashMessage}</div>
        </div>
      ) : null}

      <h2>Manage Skills</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <>
          <table>
            <thead>
              <tr>
                <th></th>
                <th align="center">ID</th>
                <th align="left">Type</th>
                <th align="center">Sequence</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {skills.map((record) => (
                <tr key={record.id}>
                  <td className="fa-icon" align="center">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: record.fontawesomeHtml || "",
                      }}
                    />
                  </td>

                  <td align="center">{record.id}</td>

                  <td align="left">
                    {record.type}
                    <br />
                    <small
                      dangerouslySetInnerHTML={{
                        __html: record.details || "",
                      }}
                    />
                  </td>

                  <td align="center">{record.sequence}</td>

                  <td align="center">
                    <Link to={`/admin/skills/${record.id}/edit`}>Edit</Link>
                  </td>

                  <td align="center">
                    {/* Use link styling from app.css (anchors are green) */}
                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      style={{
                        background: "transparent",
                        border: "none",
                        padding: 0,
                        color: "var(--green)",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/admin/skills/new">
              <i className="fas fa-plus-square" /> Add Skill
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
