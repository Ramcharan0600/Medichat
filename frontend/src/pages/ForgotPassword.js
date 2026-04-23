import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [f, setF] = useState({ email: "", regNo: "", newPassword: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const payload = { ...f, email: f.email.trim().toLowerCase() };
      const { data } = await api.post("/auth/reset-password", payload);
      setMsg("✅ " + data.msg);
      setTimeout(() => nav("/login"), 2000);
    } catch (er) {
      setErr(er.response?.data?.msg || "Error resetting password");
    }
  };

  return (
    <div className="dash" style={{minHeight:"85vh", display:"flex", alignItems:"center"}}>
      <form className="form" onSubmit={submit} style={{marginTop:0, borderTop: "5px solid #F58220"}}>
        <div className="login-header">
          <h1>LPU <span>Cure</span></h1>
          <h3 style={{color:"#1A2A56", marginTop:5, fontSize:18}}>Account Recovery</h3>
          <p>Reset your password using official credentials</p>
        </div>

        {err && <p style={{color:"red", textAlign:"center", fontSize:13, marginBottom:10}}>{err}</p>}
        {msg && <p style={{color:"green", textAlign:"center", fontSize:13, marginBottom:10}}>{msg}</p>}
        
        <label style={{fontSize:11, fontWeight:600, color:"#666"}}>University Email</label>
        <input 
          type="email" 
          placeholder="example@lpu.in" 
          value={f.email} 
          onChange={e=>setF({...f, email: e.target.value})} 
          required 
        />
        
        <label style={{fontSize:11, fontWeight:600, color:"#666"}}>Registration Number (Students Only)</label>
        <input 
          placeholder="Reg No. (Leave blank if not a student)" 
          value={f.regNo} 
          onChange={e=>setF({...f, regNo: e.target.value})} 
        />

        <label style={{fontSize:11, fontWeight:600, color:"#666"}}>New Password</label>
        <input 
          type="password" 
          placeholder="Enter new password" 
          value={f.newPassword} 
          onChange={e=>setF({...f, newPassword: e.target.value})} 
          required 
        />

        <button className="btn" style={{width:"100%", marginTop:15, fontSize:16, padding:14}}>Reset Password</button>
        
        <div className="login-footer">
          <p>Suddenly remembered? <span onClick={()=>nav("/login")} style={{color:"#F58220", cursor:"pointer", textDecoration:"underline"}}>Back to Login</span></p>
        </div>
      </form>
    </div>
  );
}
