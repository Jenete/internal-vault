import React, { useState, useRef, useEffect } from "react";
import './styles/MentionTextarea.css';

const users = ["Jenete", "Sne", "Theo", "Mitch", "Admin"]; // Sample usernames

export default function MentionTextarea({onMentions}) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cursorPos, setCursorPos] = useState(0);
  const textareaRef = useRef();

  const handleChange = (e) => {
    const val = e.target.value;
    const caret = e.target.selectionStart;
    setText(val);
    setCursorPos(caret);

    const textUntilCaret = val.slice(0, caret);
    const match = textUntilCaret.match(/@(\w*)$/);

    if (match) {
      const query = match[1].toLowerCase();
      const matches = users.filter((u) => u.toLowerCase().startsWith(query));
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (username) => {
    const before = text.slice(0, cursorPos);
    const after = text.slice(cursorPos);

    const match = before.match(/@(\w*)$/);
    if (match) {
      const updated =
        before.slice(0, match.index) + "@" + username + " " + after;
      setText(updated);
      setSuggestions([]);
      setTimeout(() => {
        textareaRef.current.focus();
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd =
          match.index + username.length + 2;
      }, 0);
    }
  };

  useEffect(()=>{
if(text) onMentions(text);
  }, [text])

  return (
    <div className="mention-box">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        rows={4}
        placeholder="@ to mention"
      />
      {suggestions.length > 0 && (
        <ul className="mention-dropdown">
          {suggestions.map((u, idx) => (
            <li key={idx} onClick={() => handleSelectSuggestion(u)}>
              <i className="fa fa-user"></i> {u}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
