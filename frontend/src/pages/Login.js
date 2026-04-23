import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Login() {
  const [email, setE] = useState(""); const [password, setP] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [userInput, setUserInput] = useState("");
  const [role, setRole] = useState("student");
  const [err, setErr] = useState("");
  
  const { login } = useAuth(); const nav = useNavigate();
  
  const roleInfo = {
    student: { title: "Student Portal", icon: "👨‍🎓", color: "#F58220" },
    doctor: { title: "Doctor Portal", icon: "👨‍⚕️", color: "#2c4380" },
    shop: { title: "Medical Store Portal", icon: "🏪", color: "#065f46" },
    delivery: { title: "Delivery Portal", icon: "🛵", color: "#c2410c" }
  };

  const gen = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let res = "";
    for (let i=0; i<6; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptcha(res);
  };

  useEffect(() => { gen(); }, []);

  const submit = async e => {
    e.preventDefault();
    if (userInput.toUpperCase() !== captcha) {
      setErr("Invalid CAPTCHA");
      gen();
      return;
    }
    try {
      const { data } = await api.post("/auth/login", { 
        email: email.trim().toLowerCase(), 
        password 
      });
      login(data.token, data.user);
      nav(`/${data.user.role}`);
    } catch (er) { setErr(er.response?.data?.msg || "Error"); gen(); }
  };
  return (
    <div className="dash" style={{minHeight:"85vh", display:"flex", alignItems:"center"}}>
      <form className="form" onSubmit={submit} style={{marginTop:0, borderTop: `5px solid ${roleInfo[role].color}`}}>
        <div className="role-tabs" style={{display:"flex", marginBottom:20, background:"#f0f2f5", borderRadius:8, padding:4}}>
          {Object.keys(roleInfo).map(r => (
            <div key={r} 
                 onClick={() => setRole(r)}
                 style={{
                   flex:1, textAlign:"center", padding:"8px 0", cursor:"pointer", borderRadius:6,
                   fontSize:11, fontWeight:600, transition:".2s",
                   background: role === r ? "#fff" : "transparent",
                   color: role === r ? roleInfo[r].color : "#666",
                   boxShadow: role === r ? "0 2px 4px rgba(0,0,0,0.1)" : "none"
                 }}>
              {roleInfo[r].icon}<br/>{r.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="login-header">
          <h1>LPU <span>Cure</span></h1>
          <h3 style={{color: roleInfo[role].color, marginTop:5, fontSize:18}}>{roleInfo[role].title}</h3>
          <p>Unified Identity & Access Management</p>
        </div>

        {err && <p style={{color:"red", textAlign:"center", fontSize:13, marginBottom:10}}>{err}</p>}
        
        <label style={{fontSize:11, fontWeight:600, color:"#666"}}>University User ID</label>
        <input placeholder={`Enter ${role} email / ID`} value={email} onChange={e=>setE(e.target.value)} required />
        
        <label style={{fontSize:11, fontWeight:600, color:"#666"}}>Password</label>
        <input type="password" placeholder="Password" value={password} onChange={e=>setP(e.target.value)} required />
        
        <div className="captcha-container">
          <div className="captcha-box">{captcha}</div>
          <button type="button" className="captcha-refresh" onClick={gen}>↻</button>
          <input 
            placeholder="Type CAPTCHA" 
            style={{margin:0, width:"130px", fontSize:13}} 
            value={userInput} 
            onChange={e=>setUserInput(e.target.value)} 
            required 
          />
        </div>

        <button className="btn" style={{width:"100%", marginTop:15, fontSize:16, padding:14, background: roleInfo[role].color}}>Secure Login</button>
        
        <div style={{textAlign:"right", marginTop:10}}>
           <span onClick={()=>nav("/forgot-password")} style={{fontSize:12, color: roleInfo[role].color, cursor:"pointer", textDecoration:"underline"}}>Forgot Password?</span>
        </div>

        <div className="login-footer">
          <p>© 2026 Lovely Professional University. All Rights Reserved.</p>
          <p style={{marginTop:10}}>Don't have an account? <span onClick={()=>nav("/register")} style={{color: roleInfo[role].color, cursor:"pointer", fontWeight:700, textDecoration:"underline"}}>Register first</span></p>
        </div>
      </form>
    </div>
  );
}
