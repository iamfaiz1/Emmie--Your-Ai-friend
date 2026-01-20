import { useEffect, useRef, useState } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);
  const chatEndRef = useRef(null);
  const containerRef = useRef(null);

  // 1. HARD LOCK: Prevents any movement of the background/body
  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.position = "fixed";
    document.documentElement.style.width = "100%";
    document.documentElement.style.height = "100%";

    document.body.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    const handleVisualViewportResize = () => {
      if (window.visualViewport && containerRef.current) {
        containerRef.current.style.height = `${window.visualViewport.height}px`;
        window.scrollTo(0, 0);
      }
    };

    window.visualViewport?.addEventListener("resize", handleVisualViewportResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleVisualViewportResize);
    };
  }, []);

  // 🔒 HARD STOP scroll chaining (ONLY change added)
  useEffect(() => {
    const preventScroll = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const wsUrl = `ws://${window.location.hostname}:8000/ws/chat`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected:", wsUrl);
    };
    ws.onmessage = (e) => {
      setMessages((prev) => [...prev, { from: "ai", text: e.data }]);
    };
    ws.onerror = (err) => {
      console.error("WebSocket error", err);
    };
    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => ws.close();
}, []);



  const sendMessage = () => {
    if (!input.trim()) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket not ready");
      return;
    }

    wsRef.current.send(input);
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
};


  return (
    <div ref={containerRef} style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>E</div>
        <span style={{ fontWeight: "600" }}>Emmie</span>
      </div>

      {/* Chat Area - ONLY scrollable area */}
      <div style={styles.chat}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.msg,
              alignSelf: m.from === "user" ? "flex-end" : "flex-start",
              background: m.from === "user" ? "#3797F0" : "#262626",
              color: "#FFFFFF",
            }}
          >
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <input
            placeholder="Message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            enterKeyHint="send"
          />
          {input.trim() && (
            <button onClick={sendMessage} style={styles.sendBtn}>
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100dvh",
    backgroundColor: "#000000",
    color: "#fafafa",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "12px 16px",
    borderBottom: "1px solid #262626",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexShrink: 0,
    backgroundColor: "#000",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    backgroundColor: "#333",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  chat: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    WebkitOverflowScrolling: "touch",
    overscrollBehavior: "contain", // 🔥 key fix
  },
  msg: {
    padding: "8px 16px",
    borderRadius: "18px",
    fontSize: "15px",
    lineHeight: "1.4",
    maxWidth: "85%",
    wordWrap: "break-word",
    marginBottom: "2px",
  },
  inputArea: {
    padding: "12px 16px",
    paddingBottom: "max(12px, env(safe-area-inset-bottom))",
    borderTop: "1px solid #262626",
    backgroundColor: "#000",
    flexShrink: 0,
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #262626",
    borderRadius: "22px",
    padding: "2px 12px 2px 16px",
    backgroundColor: "#000",
  },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "white",
    padding: "10px 0",
    outline: "none",
    fontSize: "16px",
  },
  sendBtn: {
    background: "none",
    border: "none",
    color: "#0095F6",
    fontWeight: "600",
    cursor: "pointer",
    padding: "0 8px",
  },
};

export default App;
