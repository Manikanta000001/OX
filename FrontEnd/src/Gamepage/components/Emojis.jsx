import React, { useState, useEffect } from "react";
import socket from "../../../socket";
import "./Emojis.css";

const emojis = ["😂", "🔥", "👏", "😑"];

const EmojiReactions = ({ roomid }) => {
  const [floatingEmojis, setFloatingEmojis] = useState([]);

  // When I click, send emoji event
  const sendEmoji = (emoji) => {
    socket.emit("send-emoji", { roomid, emoji });
    addEmoji(emoji); // show instantly on my screen
  };

  // Add emoji to floating list
  const addEmoji = (emoji) => {
    const id = Date.now();
    setFloatingEmojis((prev) => [...prev, { id, emoji }]);

    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== id));
    }, 2000);
  };

  useEffect(() => {
    socket.on("receive-emoji", ({ emoji }) => {
      addEmoji(emoji);
    });

    return () => {
      socket.off("receive-emoji");
    };
  }, []);

  return (
    <>
      {/* Buttons to trigger emojis */}
      <div className="emoji-buttons">
        {emojis.map((emoji) => (
          <button key={emoji} onClick={() => sendEmoji(emoji)}>
            {emoji}
          </button>
        ))}
      </div>

      {/* Floating emoji layer */}
      <div className="floating-emojis">
        {floatingEmojis.map((e) => (
          <span
            key={e.id}
            className="floating-emoji"
            style={{ left: `${Math.random() * 80 + 10}%` }}
          >
            {e.emoji}
          </span>
        ))}
      </div>
    </>
  );
};

export default EmojiReactions;
