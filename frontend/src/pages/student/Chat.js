import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
export default function Chat() {
  const nav = useNavigate();
  const [msgs, setMsgs] = useState([{ from:"bot", text:"Hi 👋 I'm LPU Cure Bot. Please fill the patient profile below and tell me your symptom." }]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState({ age: "", gender: "Male", days: "" });
  const [algo, setAlgo] = useState("bfs");
  const send = async e => {
    e.preventDefault();
    if (!input.trim()) return;
    const profileStr = `[Patient: ${profile.age}yo ${profile.gender}, suffering for ${profile.days} days]`;
    const userMsg = { from:"user", text: `${profileStr} ${input}` };
    setMsgs(m=>[...m, userMsg]);
    try {
      const { data } = await api.post("/chat/diagnose", { symptom: input, algorithm: algo });
      setMsgs(m=>[...m,
        { from:"bot", text: data.bot },
        { from:"bot", text: `(Diagnosis performed via ${data.algorithmUsed} Algorithm)` },
        { from:"bot", text: `Want to book a ${data.department} appointment? Visit Book Appointment page.` },
      ]);
    } catch { setMsgs(m=>[...m, { from:"bot", text:"Server error." }]); }
    setInput("");
  };
  return (
    <div className="chat-box" style={{maxWidth:600, margin:"20px auto"}}>
      <button className="btn btn-navy" style={{marginBottom:10}} onClick={()=>nav(-1)}>← Back to Dashboard</button>
      <div className="chat-header"><h3>🤖 LPU Cure Assistant</h3></div>
      <div className="chat-msgs">
        {msgs.map((m,i)=><div key={i} className={`msg ${m.from}`}>{m.text}</div>)}
      </div>
      <div className="patient-profile" style={{padding:"10px 15px", background:"#f0f2f5", borderTop:"1px solid #ddd", fontSize:"0.9rem"}}>
        <b style={{display:"block", marginBottom:5}}>📋 Patient Profile Checklist:</b>
        <div style={{display:"flex", gap:10, flexWrap:"wrap"}}>
          <label>Age: <input type="number" style={{width:50, padding:2}} value={profile.age} onChange={e=>setProfile({...profile, age:e.target.value})} /></label>
          <label>Gender: 
            <select style={{padding:2}} value={profile.gender} onChange={e=>setProfile({...profile, gender:e.target.value})}>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </label>
          <label>Days Suffering: <input type="number" style={{width:50, padding:2}} value={profile.days} onChange={e=>setProfile({...profile, days:e.target.value})} /></label>
        </div>
      </div>
      <div style={{padding:"5px 15px", display:"flex", gap:10, alignItems:"center", background:"#fff"}}>
         <span style={{fontSize:"11px", fontWeight:"700", color:"#666"}}>Algorithm:</span>
         <button className={`btn ${algo==="bfs"?"":"btn-navy"}`} style={{fontSize:"10px", padding:"4px 8px"}} onClick={()=>setAlgo("bfs")}>BFS (Layer)</button>
         <button className={`btn ${algo==="dfs"?"":"btn-navy"}`} style={{fontSize:"10px", padding:"4px 8px"}} onClick={()=>setAlgo("dfs")}>DFS (Deep)</button>
      </div>
      <div className="suggestions" style={{padding:"5px 15px 10px", display:"flex", gap:8, flexWrap:"wrap"}}>
        {["Fever", "Headache", "Cough", "Cold", "Body Ache"].map(s => (
          <span key={s} className="badge info" style={{cursor:"pointer"}} onClick={() => setInput(prev => prev ? `${prev}, ${s}` : s)}>{s}</span>
        ))}
      </div>
      <form className="chat-input" onSubmit={send}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your symptom…" />
        <button className="btn">Send</button>
      </form>
    </div>
  );
}
