import './App.css';
import React, { useState, useEffect } from 'react';
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = 'ja-JP'

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(()=>{
    handleListen();
  },[isListening])

  function handleListen() {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue..');
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on');
    }
    mic.onresult = event => {
      const transcirpt = Array.from(event.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');
      console.log(transcirpt);
      setNote(transcirpt);
      mic.onerror = event =>{
        console.log(event.error)
      }
    }
  }

  function handleSaveNote() {
    setSavedNotes([...savedNotes, note]);
    setNote('')
  }

  return (
    <div>
      <div>
        <h2>Current Note</h2>
        {isListening ? <span>🎙</span> : <span>🛑</span>}
        <button onClick={handleSaveNote} disabled={!note}>Save Note</button>
        <button onClick={() => setIsListening(prev => !prev)}>Start/Stop</button>
        <p>{note}</p>
      </div>
      <div>
        <h2>Notes</h2>
        {savedNotes.map(n => (
          <p key={n}>{n}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
