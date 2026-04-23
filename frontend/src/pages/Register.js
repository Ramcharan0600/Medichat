import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
export default function Register() {
  const [f, setF] = useState({ name:"", email:"", password:"", role:"student", regNo:"", hostel:"BH1", shopName:"", specialization:"General Physician" });
  const [err, setErr] = useState("");
  const { login } = useAuth(); const nav = useNavigate();
  const ch = e => setF({ ...f, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    try {
      const payload = { ...f, email: f.email.trim().toLowerCase() };
      await api.post("/auth/register", payload);
      alert("Registration Successful! Please login with your credentials.");
      nav("/login");
    } catch (er) { setErr(er.response?.data?.msg || "Error"); }
  };
  return (
    <div className="dash" style={{minHeight:"85vh", display:"flex", alignItems:"center"}}>
      <form className="form" onSubmit={submit} style={{marginTop:0, borderTop: "5px solid var(--lpu-orange)"}}>
        <div className="login-header">
          <h1>LPU <span>Cure</span></h1>
          <h3 style={{color:"var(--lpu-navy)", marginTop:5, fontSize:18}}>Create Official Account</h3>
          <p>Join the Unified Campus Healthcare Network</p>
        </div>

        {err && <p style={{color:"red", textAlign:"center", fontSize:13, marginBottom:10}}>{err}</p>}
        
        <label style={{fontSize:11, fontWeight:600}}>Full Name</label>
        <input name="name" placeholder="Name" value={f.name} onChange={ch} required />
        
        <label style={{fontSize:11, fontWeight:600}}>Official Email</label>
        <input name="email" type="email" placeholder="Email" value={f.email} onChange={ch} required />
        
        <label style={{fontSize:11, fontWeight:600}}>Password</label>
        <input name="password" type="password" placeholder="Password" value={f.password} onChange={ch} required />
        
        <label style={{fontSize:11, fontWeight:600}}>Select Your Role</label>
        <select name="role" value={f.role} onChange={ch} style={{fontWeight:600}}>
          <option value="student">👨‍🎓 Student</option>
          <option value="shop">🏪 Medical Shop</option>
          <option value="delivery">🛵 Delivery Agent</option>
          <option value="doctor">👨‍⚕️ Doctor</option>
        </select>

        {f.role==="student" && (
          <div style={{background:"#f9f9f9", padding:12, borderRadius:8, margin:"10px 0"}}>
            <label style={{fontSize:11, fontWeight:600}}>LPU Registration No.</label>
            <input name="regNo" placeholder="No." value={f.regNo} onChange={ch} required />
            <label style={{fontSize:11, fontWeight:600, marginTop:10, display:"block"}}>Hostel Block</label>
            <select name="hostel" value={f.hostel} onChange={ch}>
              <option>BH1</option><option>BH2</option><option>BH3</option><option>BH4</option><option>BH5</option>
              <option>GH1</option><option>GH2</option><option>GH3</option>
            </select>
          </div>
        )}

        {f.role==="shop" && <input name="shopName" placeholder="Official Shop Name" value={f.shopName} onChange={ch} required />}
        
        {f.role==="doctor" && (
          <div style={{background:"#f9f9f9", padding:12, borderRadius:8, margin:"10px 0"}}>
            <label style={{fontSize:11, fontWeight:600}}>Medical Specialization</label>
            <select name="specialization" value={f.specialization} onChange={ch}>
              <option>General Physician</option><option>ENT</option><option>Cardiology</option>
              <option>Neurology</option><option>Orthopedics</option><option>Dermatology</option><option>Gastroenterology</option>
            </select>
          </div>
        )}

        <button className="btn" style={{width:"100%", marginTop:15, fontSize:16, padding:14}}>Create LPU Account</button>
        
        <div className="login-footer">
          <p>Already have an account? <span onClick={()=>nav("/login")} style={{color:"var(--lpu-orange)", cursor:"pointer", textDecoration:"underline"}}>Sign In</span></p>
        </div>
      </form>
    </div>
  );
}
