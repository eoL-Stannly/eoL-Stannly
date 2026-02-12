import React, { useState, useRef } from 'react';

const FORMAT_OPTIONS = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'csv', label: 'CSV / Spreadsheet' },
  { value: 'html', label: 'HTML Report' },
  { value: 'json', label: 'JSON Data' },
  { value: 'pdf', label: 'PDF Document' },
];

const AGENT_OPTIONS = [
  { value: '', label: 'Auto (best match)' },
  { value: 'rob', label: 'Rob — Principal SEO' },
  { value: 'craig', label: 'Craig — SEO Director' },
  { value: 'leo', label: 'Leo — SEO Director' },
  { value: 'ewan', label: 'Ewan — Head of SEO' },
  { value: 'mya', label: 'Mya — Account Manager' },
  { value: 'alex', label: 'Alex — Data Engineer' },
  { value: 'ken', label: 'Ken — Data Engineer' },
];

export default function TaskConfigModal({ taskType, onSubmit, onClose }) {
  const [brief, setBrief] = useState('');
  const [links, setLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [files, setFiles] = useState([]);
  const [format, setFormat] = useState('markdown');
  const [assignTo, setAssignTo] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleAddLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed && !links.includes(trimmed)) {
      setLinks((prev) => [...prev, trimmed]);
      setLinkInput('');
    }
  };

  const handleLinkKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddLink();
    }
  };

  const handleRemoveLink = (idx) => {
    setLinks((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files);
    addFiles(selected);
  };

  const addFiles = (newFiles) => {
    const MAX_SIZE = 10 * 1024 * 1024;
    const valid = newFiles.filter((f) => f.size <= MAX_SIZE);
    setFiles((prev) => [...prev, ...valid.map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      preview: null,
    }))]);

    // Read text content for text-based files
    for (const f of valid) {
      if (isTextFile(f)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles((prev) => prev.map((pf) =>
            pf.name === f.name ? { ...pf, preview: e.target.result.slice(0, 2000) } : pf
          ));
        };
        reader.readAsText(f);
      }
    }
  };

  const handleRemoveFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async () => {
    // Build full task description with all context
    let fullDescription = taskType.desc;

    if (brief.trim()) {
      fullDescription += `\n\nClient Brief:\n${brief.trim()}`;
    }

    if (links.length > 0) {
      fullDescription += `\n\nReference Links:\n${links.map((l) => `- ${l}`).join('\n')}`;
    }

    // Read file contents and include them
    const fileContents = [];
    for (const f of files) {
      if (f.preview) {
        fileContents.push({ name: f.name, content: f.preview });
      } else if (isTextFile(f.file)) {
        const content = await readFileAsync(f.file);
        fileContents.push({ name: f.name, content: content.slice(0, 10000) });
      } else {
        fileContents.push({ name: f.name, content: `[Binary file: ${f.name}, ${formatFileSize(f.size)}]` });
      }
    }

    if (fileContents.length > 0) {
      fullDescription += `\n\nAttached Documents:\n`;
      for (const fc of fileContents) {
        fullDescription += `--- ${fc.name} ---\n${fc.content}\n\n`;
      }
    }

    if (format !== 'markdown') {
      fullDescription += `\n\nRequested Output Format: ${format.toUpperCase()}`;
    }

    onSubmit(fullDescription, {
      taskType: taskType.label,
      brief: brief.trim(),
      links,
      fileNames: files.map((f) => f.name),
      format,
      assignTo: assignTo || null,
    });
  };

  return (
    <div className="task-config-overlay" onClick={onClose}>
      <div className="task-config-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="task-config-header">
          <div className="task-config-title">{taskType.label}</div>
          <button className="task-config-close" onClick={onClose}>X</button>
        </div>
        <div className="task-config-subtitle">{taskType.desc}</div>

        {/* Scrollable body */}
        <div className="task-config-body">
          {/* Brief / Description */}
          <div className="task-config-field">
            <label className="task-config-label">Brief / Requirements</label>
            <textarea
              className="task-config-textarea"
              placeholder="Describe what you need, any specific requirements, target audience, scope..."
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={4}
            />
          </div>

          {/* Links */}
          <div className="task-config-field">
            <label className="task-config-label">Reference Links</label>
            <div className="task-config-link-input">
              <input
                type="text"
                className="task-config-input"
                placeholder="https://example.com"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={handleLinkKeyDown}
              />
              <button className="task-config-add-btn" onClick={handleAddLink} type="button">Add</button>
            </div>
            {links.length > 0 && (
              <div className="task-config-links-list">
                {links.map((link, i) => (
                  <div key={i} className="task-config-link-item">
                    <span className="task-config-link-url">{link}</span>
                    <button className="task-config-link-remove" onClick={() => handleRemoveLink(i)}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* File Attachments */}
          <div className="task-config-field">
            <label className="task-config-label">Attachments</label>
            <div
              className={`task-config-dropzone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="task-config-dropzone-text">
                Drop files here or click to browse
              </div>
              <div className="task-config-dropzone-hint">
                PDF, CSV, TXT, MD, HTML, JSON, XML — up to 10MB
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileSelect}
                accept=".pdf,.csv,.txt,.md,.html,.htm,.json,.xml,.doc,.docx,.rtf,.xls,.xlsx"
              />
            </div>
            {files.length > 0 && (
              <div className="task-config-files-list">
                {files.map((f, i) => (
                  <div key={i} className="task-config-file-item">
                    <span className="task-config-file-icon">{getFileIcon(f.name)}</span>
                    <span className="task-config-file-name">{f.name}</span>
                    <span className="task-config-file-size">{formatFileSize(f.size)}</span>
                    <button className="task-config-file-remove" onClick={() => handleRemoveFile(i)}>x</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Options row */}
          <div className="task-config-options">
            <div className="task-config-field task-config-half">
              <label className="task-config-label">Output Format</label>
              <select className="task-config-select" value={format} onChange={(e) => setFormat(e.target.value)}>
                {FORMAT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="task-config-field task-config-half">
              <label className="task-config-label">Assign To</label>
              <select className="task-config-select" value={assignTo} onChange={(e) => setAssignTo(e.target.value)}>
                {AGENT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="task-config-footer">
          <button className="task-config-cancel" onClick={onClose}>Cancel</button>
          <button className="task-config-submit" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}

function isTextFile(file) {
  const textTypes = ['text/', 'application/json', 'application/xml', 'application/csv'];
  const textExts = ['.txt', '.md', '.csv', '.json', '.xml', '.html', '.htm', '.rtf'];
  if (textTypes.some((t) => file.type?.startsWith(t))) return true;
  return textExts.some((ext) => file.name?.toLowerCase().endsWith(ext));
}

function readFileAsync(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const icons = {
    pdf: '📄', csv: '📊', xls: '📊', xlsx: '📊',
    txt: '📝', md: '📝', doc: '📝', docx: '📝', rtf: '📝',
    html: '🌐', htm: '🌐', xml: '🔧', json: '🔧',
  };
  return icons[ext] || '📎';
}
