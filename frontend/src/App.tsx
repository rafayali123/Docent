// import { useState, type ChangeEvent } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// import { uploadFile, askQuestion } from "./Services/api";
// import { DocentLogo } from "./components/DocentLogo";
// import "./App.css";

// // Interface for Chat Messages
// interface Message {
//   role: "user" | "assistant";
//   content: string;
// }

// function App() {
//   const [file, setFile] = useState<File | null>(null);
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [uploadStatus, setUploadStatus] = useState<string>("");

//   // 1. State add karo (Active Document Info)
//   const [documentInfo, setDocumentInfo] = useState<{
//     filename: string;
//     chunks: number;
//   } | null>(null);

//   const [question, setQuestion] = useState<string>("");
//   const [loading, setLoading] = useState<boolean>(false);

//   // Chat History State
//   const [messages, setMessages] = useState<Message[]>([]);

//   // File Input Handler
//   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setFile(e.target.files[0]);
//       setUploadStatus("");
//     }
//   };

//   // PDF Upload Handler
//   const handleUpload = async () => {
//     if (!file) return;

//     try {
//       setUploading(true);
//       setUploadStatus("");

//       const data = await uploadFile(file);

//       // Explicitly extract total chunks with a default fallback (e.g., 0)
//       const totalChunks: number = data.chunks ?? data.total_pages ?? 0;

//       // Set the active document metadata safely
//       setDocumentInfo({
//         filename: data.filename || file.name,
//         chunks: totalChunks,
//       });

//       setUploadStatus(
//         `Successfully indexed "${data.filename || file.name}". Pages processed: ${totalChunks}.`
//       );
//     } catch (error: unknown) {
//       let errorMessage = "Failed to upload file.";

//       if (axios.isAxiosError(error)) {
//         errorMessage =
//           error.response?.data?.detail || "Failed to upload file.";
//       }

//       setUploadStatus(errorMessage);
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Ask Question & Stream Response Handler
//   const handleAsk = async () => {
//     if (!question.trim()) return;

//     const userQuestion = question.trim();

//     // Optimistically add user message to chat stream
//     setMessages((prev) => [
//       ...prev,
//       {
//         role: "user",
//         content: userQuestion,
//       },
//     ]);

//     setQuestion("");

//     try {
//       setLoading(true);

//       const data = await askQuestion(userQuestion);

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: data.answer,
//         },
//       ]);
//     } catch (error: unknown) {
//       let errorMessage = "Something went wrong.";

//       if (axios.isAxiosError(error)) {
//         errorMessage =
//           error.response?.data?.detail || "Something went wrong.";
//       }

//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: errorMessage,
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="app">
//       {/* Background Glows */}
//       <div className="background-glow glow-one" />
//       <div className="background-glow glow-two" />

//       {/* Navbar */}
//       <nav className="navbar">
//         <div className="brand">
//           <div className="brand-icon">
//             <DocentLogo />
//           </div>
//           <div>
//             <h2>DOCENT</h2>
//             <span>DOCUMENT INTELLIGENCE</span>
//           </div>
//         </div>

//         <div className="status">
//           <span className="status-dot" />
//           Engine Online
//         </div>
//       </nav>

//       {/* Main Container */}
//       <main className="container">
//         {/* Hero Header */}
//         <section className="hero">
//           <div className="badge">
//             <DocentLogo size={14} />
//             Ask. Understand. Retain.
//           </div>
//           <h1>
//             Ask anything. <span>Understand everything.</span>
//           </h1>
//           <p>
//             Docent reads your documents so you don't have to — ask anything,
//             get real answers instantly.
//           </p>
//         </section>

//         {/* Workspace Grid */}
//         <div className="workspace">
//           {/* Card 1: Document Upload */}
//           <section className="card">
//             <div className="card-header">
//               <div>
//                 <span className="section-label">01</span>
//                 <h3>Upload Document</h3>
//               </div>
//               <div className="icon-box">
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
//                   <polyline points="14 2 14 8 20 8" />
//                 </svg>
//               </div>
//             </div>

//             <label className="drop-zone">
//               <input
//                 type="file"
//                 accept=".pdf"
//                 onChange={handleFileChange}
//               />
//               <div className="upload-icon">↑</div>
//               {file ? (
//                 <>
//                   <strong>{file.name}</strong>
//                   <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
//                 </>
//               ) : (
//                 <>
//                   <strong>Choose your PDF</strong>
//                   <span>Click here to browse your files</span>
//                 </>
//               )}
//             </label>

//             <button
//               className="primary-button"
//               onClick={handleUpload}
//               disabled={!file || uploading}
//             >
//               {uploading ? (
//                 <>
//                   <div className="spinner" />
//                   Processing document...
//                 </>
//               ) : (
//                 <>
//                   Index PDF <span>→</span>
//                 </>
//               )}
//             </button>

//             {/* Text status appears ONLY for errors or before the document card renders */}
//             {uploadStatus && !documentInfo && (
//               <div
//                 className={`upload-status ${uploadStatus.includes("Successfully") ? "success" : "error"
//                   }`}
//               >
//                 <span>{uploadStatus.includes("Successfully") ? "✓" : "!"}</span>
//                 {uploadStatus}
//               </div>
//             )}

//             {/* Active Document Widget */}
//             {documentInfo && (
//               <div className="document-info">
//                 <div className="document-icon">PDF</div>

//                 <div className="document-details">
//                   <strong>{documentInfo.filename}</strong>
//                   <span>{documentInfo.chunks} chunks indexed</span>
//                 </div>

//                 <div className="document-status">
//                   <span />
//                   Ready
//                 </div>
//               </div>
//             )}

//           </section>

//           {/* Card 2: Question Input */}
//           <section className="card">
//             <div className="card-header">
//               <div>
//                 <span className="section-label">02</span>
//                 <h3>Ask your document</h3>
//               </div>
//               <div className="icon-box">
//                 <svg
//                   width="16"
//                   height="16"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                 >
//                   <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 7.92c0 .13 0 .261 0 .391 0 .132 0 .263 0 .393a7.5 7.5 0 0 0-7.92 7.92c-.13 0-.261 0-.391 0-.132 0-.263 0-.393 0a7.5 7.5 0 0 0-7.92-7.92c0-.13 0-.261 0-.391 0-.132 0-.263 0-.393a7.5 7.5 0 0 0 7.92-7.92c.13 0 .261 0 .391 0z" />
//                 </svg>
//               </div>
//             </div>

//             <div className="question-area">
//               <textarea
//                 placeholder="Ask anything about your document..."
//                 value={question}
//                 onChange={(e) => setQuestion(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleAsk();
//                   }
//                 }}
//                 rows={6}
//               />
//               <div className="question-footer">
//                 <span>Enter ↵ · Shift+Enter ⏎</span>
//                 <button
//                   className="ask-button"
//                   onClick={handleAsk}
//                   disabled={loading || !question.trim()}
//                 >
//                   {loading ? (
//                     <span className="spinner" />
//                   ) : (
//                     "Ask Docent"
//                   )}
//                   {!loading && <span>↗</span>}
//                 </button>
//               </div>
//             </div>
//           </section>
//         </div>

//         {/* Conversation Stream & Chat History */}
//         {messages.length > 0 && (
//           <section className="chat-card">
//             <div className="chat-header">
//               <div>
//                 <span className="section-label">03</span>
//                 <h3>Conversation</h3>
//               </div>

//               <button
//                 className="clear-button"
//                 onClick={() => setMessages([])}
//               >
//                 Clear
//               </button>
//             </div>

//             <div className="messages">
//               {messages.map((message, index) => (
//                 <div
//                   key={index}
//                   className={`message ${message.role === "user"
//                     ? "user-message"
//                     : "assistant-message"
//                     }`}
//                 >
//                   <div className="message-avatar">
//                     {message.role === "user" ? (
//                       "You"
//                     ) : (
//                       <DocentLogo size={14} />
//                     )}
//                   </div>

//                   <div className="message-body">
//                     <span className="message-role">
//                       {message.role === "user" ? "You" : "Docent"}
//                     </span>

//                     {message.role === "assistant" ? (
//                       <div className="markdown-content">
//                         <ReactMarkdown>{message.content}</ReactMarkdown>
//                       </div>
//                     ) : (
//                       <p>{message.content}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Typing / Thinking Indicator */}
//               {loading && (
//                 <div className="message assistant-message">
//                   <div className="message-avatar">
//                     <DocentLogo size={14} />
//                   </div>

//                   <div className="message-body">
//                     <span className="message-role">Docent</span>

//                     <div className="typing">
//                       <span />
//                       <span />
//                       <span />
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </section>
//         )}

//         {/* Empty State */}
//         {messages.length === 0 && (
//           <section className="empty-state">
//             <div className="empty-icon">
//               <DocentLogo size={22} />
//             </div>

//             <h3>Ask. Understand. Retain.</h3>

//             <p>
//               Drop in a PDF. Ask a question. Get answers grounded in
//               your document — not guesses.
//             </p>
//           </section>
//         )}
//       </main>

//       {/* Footer */}
//       <footer>
//         <span>Docent</span>
//         <span>•</span>
//         <span>Documents, Explained.</span>
//       </footer>
//     </div>
//   );
// }

// export default App;












































import { useState, type ChangeEvent } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { uploadFile, askQuestion } from "./Services/api";
import { DocentLogo } from "./components/DocentLogo";
import "./App.css";

// Interface for Chat Messages
interface Message {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  // Active Document Metadata State
  const [documentInfo, setDocumentInfo] = useState<{
    document_id?: string;
    filename: string;
    chunks: number;
  } | null>(null);

  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Chat History State
  const [messages, setMessages] = useState<Message[]>([]);

  // File Input Handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setUploadStatus("Only PDF files are allowed.");
      setFile(null);
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadStatus("PDF must be smaller than 10 MB.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setUploadStatus("");
    setDocumentInfo(null); // Reset active document when selecting a new valid file
  };

  // PDF Upload Handler
  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadStatus("");

      const data = await uploadFile(file);

      // Extract total chunks with default fallback
      const totalChunks: number = data.chunks ?? data.total_pages ?? 0;

      // Set active document metadata with document_id support
      setDocumentInfo({
        document_id: data.document_id || data.filename || file.name,
        filename: data.filename || file.name,
        chunks: totalChunks,
      });

      setUploadStatus(
        `Successfully indexed "${data.filename || file.name}". Chunks processed: ${totalChunks}.`
      );
    } catch (error: unknown) {
      let errorMessage = "Failed to upload file.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.detail || "Failed to upload file.";
      }

      setUploadStatus(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  // Ask Question Handler
  const handleAsk = async () => {
    if (!question.trim()) return;

    // Guard Clause: Check if a document has been uploaded and indexed
    if (!documentInfo) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Please upload and index a PDF before asking a question.",
        },
      ]);
      return;
    }

    const userQuestion = question.trim();

    // Optimistically add user message to chat stream
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    setQuestion("");

    try {
      setLoading(true);

      // Pass document_id (or filename as fallback) to scoped RAG query
      const activeDocId = documentInfo.document_id || documentInfo.filename;
      const data = await askQuestion(userQuestion, activeDocId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (error: unknown) {
      let errorMessage = "Something went wrong.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.detail || "Something went wrong.";
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Background Glows */}
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      {/* Navbar */}
      <nav className="navbar">
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
      </nav>

      {/* Main Container */}
      <main className="container">
        {/* Hero Header */}
        <section className="hero">
          <div className="badge">
            <DocentLogo size={14} />
            Ask. Understand. Retain.
          </div>
          <h1>
            Ask anything. <span>Understand everything.</span>
          </h1>
          <p>
            Docent reads your documents so you don't have to — ask anything,
            get real answers instantly.
          </p>
        </section>

        {/* Workspace Grid */}
        <div className="workspace">
          {/* Card 1: Document Upload */}
          <section className="card">
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
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
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
              disabled={!file || uploading}
            >
              {uploading ? (
                <>
                  <div className="spinner" />
                  Processing document...
                </>
              ) : (
                <>
                  Index PDF <span>→</span>
                </>
              )}
            </button>

            {/* Text status appears ONLY for errors or before the document card renders */}
            {uploadStatus && !documentInfo && (
              <div
                className={`upload-status ${
                  uploadStatus.includes("Successfully") ? "success" : "error"
                }`}
              >
                <span>{uploadStatus.includes("Successfully") ? "✓" : "!"}</span>
                {uploadStatus}
              </div>
            )}

            {/* Active Document Widget */}
            {documentInfo && (
              <div className="document-info">
                <div className="document-icon">PDF</div>

                <div className="document-details">
                  <strong>{documentInfo.filename}</strong>
                  <span>{documentInfo.chunks} chunks indexed</span>
                </div>

                <div className="document-status">
                  <span />
                  Ready
                </div>
              </div>
            )}
          </section>

          {/* Card 2: Question Input */}
          <section className="card">
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
                placeholder={
                  documentInfo
                    ? "Ask anything about your PDF..."
                    : "Upload a PDF first..."
                }
                value={question}
                disabled={!documentInfo}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!loading && question.trim() && documentInfo) {
                      handleAsk();
                    }
                  }
                }}
                rows={6}
              />
              <div className="question-footer">
                <span>Enter ↵ · Shift+Enter ⏎</span>
                <button
                  className="ask-button"
                  onClick={handleAsk}
                  disabled={loading || !question.trim() || !documentInfo}
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
          </section>
        </div>

        {/* Conversation Stream & Chat History */}
        {messages.length > 0 && (
          <section className="chat-card">
            <div className="chat-header">
              <div>
                <span className="section-label">03</span>
                <h3>Conversation</h3>
              </div>

              <button
                className="clear-button"
                onClick={() => setMessages([])}
              >
                Clear
              </button>
            </div>

            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${
                    message.role === "user"
                      ? "user-message"
                      : "assistant-message"
                  }`}
                >
                  <div className="message-avatar">
                    {message.role === "user" ? (
                      "You"
                    ) : (
                      <DocentLogo size={14} />
                    )}
                  </div>

                  <div className="message-body">
                    <span className="message-role">
                      {message.role === "user" ? "You" : "Docent"}
                    </span>

                    {message.role === "assistant" ? (
                      <div className="markdown-content">
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing / Thinking Indicator */}
              {loading && (
                <div className="message assistant-message">
                  <div className="message-avatar">
                    <DocentLogo size={14} />
                  </div>

                  <div className="message-body">
                    <span className="message-role">Docent</span>

                    <div className="typing">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Empty State */}
        {messages.length === 0 && (
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

      {/* Footer */}
      <footer>
        <span>Docent</span>
        <span>•</span>
        <span>Documents, Explained.</span>
      </footer>
    </div>
  );
}

export default App;