import React, { useEffect, useState } from "react";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
} from "../controllers/DocumentController";
import SharedToaster from "./SharedToaster";
import LoadingSpinner from "./LoadingSpinner";
import "./styles/UploadDocument.css";

export default function UploadDocument({ projectId }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("success");
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoadingDocs(true);
    const docs = await getDocuments();
    const filtered = docs.filter(doc => doc.projectId === projectId);
    setDocuments(filtered);
    setLoadingDocs(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      setUploading(true);
      const metadata = { projectId };
      await uploadDocument(file, metadata);
      setStatus("Upload successful");
      setType("success");
      await fetchDocuments();
    } catch (err) {
      console.error(err);
      setStatus("Upload failed");
      setType("error");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleDelete = async (docId, fileName) => {
    await deleteDocument(docId, fileName);
    await fetchDocuments();
  };

  return (
  <div className="rl-upload-doc">
    <h3><i className="fa fa-file-upload"></i> Upload Project File</h3>

    <div className="rl-upload-form">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading || !file}>
        <i className="fa fa-upload"></i> Upload
      </button>
    </div>

    {uploading && <LoadingSpinner message="Uploading..." />}
    {status && <SharedToaster message={status} type={type} />}

    <h4><i className="fa fa-folder-open"></i> Uploaded Documents</h4>
    {loadingDocs ? (
      <LoadingSpinner message="Loading documents..." />
    ) : (
      <ul className="rl-doc-list">
        {documents.map((doc) => (
          <li key={doc.id} className="rl-doc-item">
            <div className="rl-doc-info">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rl-doc-link"
                title={doc.fileName}
              >
                <i className="fa fa-file-alt"></i>{" "}
                {doc.fileName?.length > 35
                  ? doc.fileName.substring(0, 35) + "..."
                  : doc.fileName}
              </a>
              <br></br>
              <small>
                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()} •{" "}
                {(doc.size / 1024).toFixed(1)} KB
              </small>
            </div>

            <div className="rl-doc-actions">
              <button
                className="rl-doc-copy"
                onClick={() => navigator.clipboard.writeText(doc.fileUrl)}
                title="Copy Link"
              >
                <i className="fa fa-link"></i>
              </button>
              <button
                className="rl-doc-delete"
                onClick={() => handleDelete(doc.id, doc.fileName)}
                title="Delete File"
              >
                <i className="fa fa-trash"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);
}
