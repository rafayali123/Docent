import React, { useState } from "react";
import axios from "axios";
import { uploadPDF, askQuestion } from "./Services/api";
import { DocentLogo } from "./components/DocentLogo";
import "./App.css";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setUploadMessage("");
    setIsUploaded(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setUploadMessage("");

      const data = await uploadPDF(file);

      setUploadMessage(
        `${data.chunks} chunks indexed successfully`
      );

      setIsUploaded(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setUploadMessage(
          error.response?.data?.detail || "Upload failed."
        );
      } else {
        setUploadMessage("Upload failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      const data = await askQuestion(question);

      setAnswer(data.answer);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setAnswer(
          error.response?.data?.detail ||
          "Something went wrong."
        );
      } else {
        setAnswer("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="app">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">
            <DocentLogo />
          </div>

          <div>
            <h2>DOCENT</h2>
            <span>DOCUMENT INTELLIGENCE</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot" />
          Engine Online
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div className="badge">
            <DocentLogo size={14} />
            Ask. Understand. Retain.
          </div>

          <h1>
            Ask anything.
            <span> Understand everything.</span>
          </h1>

          <p>
            Docent reads your documents so you don't have to — ask anything,
            get real answers instantly.
          </p>
        </section>

        <section className="workspace">
          {/* Upload Card */}
          <div className="card upload-card">
            <div className="card-header">
              <div>
                <span className="section-label">01</span>
                <h3>Upload Document</h3>
              </div>

              <div className="icon-box">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
            </div>

            <label className="drop-zone">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />

              <div className="upload-icon">↑</div>

              {file ? (
                <>
                  <strong>{file.name}</strong>
                  <span>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                <>
                  <strong>Choose your PDF</strong>
                  <span>Click here to browse your files</span>
                </>
              )}
            </label>

            <button
              className="primary-button"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Processing document...
                </>
              ) : (
                <>
                  Index PDF
                  <span>→</span>
                </>
              )}
            </button>

            {uploadMessage && (
              <div
                className={`upload-status ${isUploaded ? "success" : "error"
                  }`}
              >
                <span>{isUploaded ? "✓" : "!"}</span>
                {uploadMessage}
              </div>
            )}
          </div>

          {/* Question Card */}
          <div className="card question-card">
            <div className="card-header">
              <div>
                <span className="section-label">02</span>
                <h3>Ask your document</h3>
              </div>

              <div className="icon-box">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 7.92c0 .13 0 .261 0 .391 0 .132 0 .263 0 .393a7.5 7.5 0 0 0-7.92 7.92c-.13 0-.261 0-.391 0-.132 0-.263 0-.393 0a7.5 7.5 0 0 0-7.92-7.92c0-.13 0-.261 0-.391 0-.132 0-.263 0-.393a7.5 7.5 0 0 0 7.92-7.92c.13 0 .261 0 .391 0z" />
                </svg>
              </div>
            </div>

            <div className="question-area">
              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your document..."
                rows={6}
              />

              <div className="question-footer">
                <span>
                  Enter ↵ · Shift+Enter ⏎
                </span>

                <button
                  className="ask-button"
                  onClick={handleAsk}
                  disabled={!question.trim() || loading}
                >
                  {loading ? (
                    <span className="spinner" />
                  ) : (
                    "Ask Docent"
                  )}
                  {!loading && <span>↗</span>}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Answer */}
        {answer && (
          <section className="answer-card">
            <div className="answer-header">
              <div className="ai-avatar">
                <DocentLogo size={20} />
              </div>

              <div>
                <span>Docent</span>
                <small>Generated from your document</small>
              </div>
            </div>

            <div className="answer-content">
              <h3>Answer</h3>
              <p>{answer}</p>
            </div>
          </section>
        )}

        {/* Empty state */}
        {!answer && (
          <section className="empty-state">
            <div className="empty-icon">
              <DocentLogo size={22} />
            </div>

            <h3>Ask. Understand. Retain.</h3>

            <p>
              Drop in a PDF. Ask a question. Get answers grounded in
              your document — not guesses.
            </p>
          </section>
        )}
      </main>

      <footer>
        <span>Docent</span>
        <span>•</span>
        <span>Documents, Explained.</span>
      </footer>
    </div>
  );
}

export default App;