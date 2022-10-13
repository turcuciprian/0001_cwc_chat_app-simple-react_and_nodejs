import "./App.css";
import io from "socket.io-client";
import { useCallback, useEffect, useState } from "react";
const socket = io("http://localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [username, setUserName] = useState("");
  const [showConfig, setShowConfig] = useState(true);
  const [messages, setMessages] = useState([]); // example: [{user: 'some user',message:'bslah blah'},{user: 'some user',message:'blah blah'}]
  const [lastMessage, setLastMessage] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("message", (newMessage) => {
      const allMessages = JSON.parse(JSON.stringify(messages));
      allMessages.push(newMessage);
      setMessages(allMessages);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("message");
    };
  }, [messages]);
  const saveUser = useCallback(() => {
    setShowConfig(false);
  }, []);
  const sendMessage = useCallback(() => {
    const newMessage = { user: username, message: lastMessage };
    socket.emit("message", newMessage);
    setMessages([...messages, newMessage]);
    setLastMessage("");
  }, [username, lastMessage]);
  return (
    <div className="App">
      <header className="App-header">
        {isConnected ? <p>Connected</p> : null}

        {/* Config JSX */}
        {showConfig ? (
          <div className="config">
            User Name <br />
            <input
              type={"text"}
              value={username}
              onChange={(e) => {
                const newInputValue = e.target.value;
                setUserName(newInputValue);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  saveUser();
                }
              }}
            />
            <button onClick={() => saveUser()}>Save</button>
          </div>
        ) : (
          <>
            <div className="messages">
              {messages.map((item, index) => {
                return item.user ? (
                  <p key={`message${index}`}>
                    <b>{item.user}:</b> {item.message}
                  </p>
                ) : null;
              })}
            </div>
            <div className="messageWrapper">
              <input
                value={lastMessage}
                onChange={(e) => setLastMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
