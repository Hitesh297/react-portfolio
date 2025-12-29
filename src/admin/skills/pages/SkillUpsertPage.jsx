import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "./SkillUpsertPage.css";
import { API_BASE_URL } from "../../../config/api";

export default function SkillUpsertPage() {
  const { id } = useParams();              // undefined on /new
  const isEdit = !!id;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit); // only load when edit
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [errors, setErrors] = useState({
    fontawesomeHtml: "",
    type: "",
    details: "",
    sequence: "",
  });

  const [form, setForm] = useState({
    fontawesomeHtml: "",
    type: "",
    sequence: 0,
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: { attributes: { class: "tiptap-editor" } },
  });

  function setField(name, value) {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
    setSubmitError("");
  }

  function validate(payload) {
    const next = { fontawesomeHtml: "", type: "", details: "", sequence: "" };
    if (!payload.type.trim()) next.type = "Type is required.";
    if (payload.sequence === "" || Number.isNaN(Number(payload.sequence)))
      next.sequence = "Sequence must be a number.";
    return next;
  }

  // Load existing skill only in edit mode
  useEffect(() => {
    if (!isEdit || !editor) return;

    (async () => {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/skill/${id}`);
        if (!res.ok) throw new Error(`Failed to load skill (${res.status})`);
        const data = await res.json();

        setForm({
          fontawesomeHtml: data.fontawesomeHtml ?? "",
          type: data.type ?? "",
          sequence: data.sequence ?? 0,
        });

        editor.commands.setContent(data.details ?? "", false);
      } catch (e) {
        setLoadError(e.message || "Failed to load skill");
      } finally {
        setLoading(false);
      }
    })();
  }, [isEdit, id, editor]);

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError("");

    const detailsHtml = editor?.getHTML() ?? "";

    const payload = {
      fontawesomeHtml: form.fontawesomeHtml,
      type: form.type,
      details: detailsHtml,
      sequence: Number(form.sequence),
    };

    const fieldErrors = validate(payload);
    if (Object.values(fieldErrors).some(Boolean)) {
      setErrors(fieldErrors);
      return;
    }

    try {
      const url = isEdit ? `${API_BASE}/api/skills/${id}` : `${API_BASE}/api/skills`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`${isEdit ? "Update" : "Create"} failed (${res.status})`);

      navigate("/admin/skills", {
        state: { message: isEdit ? "Skill updated successfully." : "Skill created successfully." },
      });
    } catch (e2) {
      setSubmitError(e2.message || "Save failed");
    }
  }

  if (loading) return <section className="w3-padding">Loading...</section>;
  if (loadError) return <section className="w3-padding"><p className="error">{loadError}</p></section>;

  return (
    <section className="w3-padding">
      <h2>{isEdit ? "Edit Skill" : "Add Skill"}</h2>

      {submitError ? <p className="error">{submitError}</p> : null}

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="fontawesomeHtml">Font Awesome HTML:</label>
        <input
          className="form-control"
          id="fontawesomeHtml"
          value={form.fontawesomeHtml}
          onChange={(e) => setField("fontawesomeHtml", e.target.value)}
        />
        {errors.fontawesomeHtml ? <span className="field-error">{errors.fontawesomeHtml}</span> : null}

        <br />

        <label htmlFor="type">Type:</label>
        <input
          className="form-control"
          id="type"
          value={form.type}
          onChange={(e) => setField("type", e.target.value)}
        />
        {errors.type ? <span className="field-error">{errors.type}</span> : null}

        <br />

        <label>Details:</label>
        <div className="tiptap-toolbar">
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}>
            Bold
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}>
            Italic
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            • List
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            1. List
          </button>
        </div>
        <EditorContent editor={editor} />

        <br />

        <label htmlFor="sequence">Sequence:</label>
        <input
          className="form-control"
          type="number"
          id="sequence"
          value={form.sequence}
          onChange={(e) => setField("sequence", e.target.value)}
        />
        {errors.sequence ? <span className="field-error">{errors.sequence}</span> : null}

        <br />

        <input type="submit" value={isEdit ? "Update Skill" : "Create Skill"} />
      </form>

      <p>
        <Link to="/admin/skills">
          <i className="fas fa-arrow-circle-left"></i> Return to Skills List
        </Link>
      </p>
    </section>
  );
}
