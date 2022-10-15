import "./App.css";
import io from "socket.io-client";
import { useCallback, useEffect, useState } from "react";
const socket = io("http://localhost:3001");

function App() {
  const [isConnected, setIsConnected] = useState(false);
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
  }, [messages, setIsConnected]);
  const saveUser = useCallback(() => {
    setShowConfig(false);
  }, []);
  const sendMessage = useCallback(() => {
    const newMessage = { user: username || 'unknown user', message: lastMessage };
    socket.emit("message", newMessage);
    setMessages([...messages, newMessage]);
    setLastMessage("");
  }, [username, lastMessage]);
  return (
    <div className="App">
      <header className="App-header">
        {isConnected ?
          <div className="connection-information">
            <b>User</b>: {username} <span>Connected</span>{!showConfig ? (
              <button
              onClick={()=>{
                setShowConfig(true);
              }}
              >Config</button>
            ) : null} </div> : null}

        {/* Config JSX */}
        {showConfig ? (
          <div className="config">
            <h2>Settings</h2>
            User Name <br />
            <input
              autoFocus
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
                return item ? (
                  <p key={`message${index}`}>
                    <b>{item.user}:</b> {item.message}
                  </p>
                ) : null;
              })}
            </div>
            <div className="messageWrapper">
              Message: <input
                autoFocus
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
