import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./dashboard.css";

const dashboardItems = [
  { to: "/console/contactforms/list", label: "Contact Form" },
  { to: "/console/textcontents/list", label: "Manage Text Content" },
  { to: "/console/experiences/list", label: "Manage Experience" },
  { to: "/console/qualifications/list", label: "Manage Qualifications" },
  { to: "/console/skills/list", label: "Manage Skills" },
  { to: "/console/socialmedias/list", label: "Manage Social Media Links" },
  { to: "/console/projects/list", label: "Manage Projects" },
  { to: "/console/users/list", label: "Manage Users" },
  { to: "/auth/logout", label: "Logout" },
];

function AdminDashboard() {
   return (
    <section className="dashboard-section">
      <ul id="dashboard">
        {dashboardItems.map((item) => (
          <li key={item.to}>
            <Link to={item.to}>
              <div className="dashboard-item">{item.label}</div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default AdminDashboard
