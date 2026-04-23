import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
export default function Book() {
  const nav = useNavigate();
  const [symptom, setSymptom] = useState("");
  const [dept, setDept] = useState("General Physician");
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [time, setTime] = useState("");

  const refresh = () => api.get("/appointments/mine").then(r=>setList(r.data));
  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (dept) {
      api.get(`/doctor?specialization=${dept}`).then(r => {
        setDoctors(r.data);
        if (r.data.length > 0) setSelectedDoctor(r.data[0]._id);
        else setSelectedDoctor("");
      });
    }
  }, [dept]);

  const autoSuggest = async () => {
    if (!symptom) return;
    const { data } = await api.post("/chat/diagnose", { symptom, algorithm:"bfs" });
    setDept(data.department);
    setMsg(`🤖 Bot suggests: ${data.department}`);
  };

  const book = async (source) => {
    const payload = { 
      symptoms: [symptom], 
      department: dept, 
      source,
      doctorId: selectedDoctor,
      scheduledAt: time 
    };
    const { data } = await api.post("/appointments", payload);
    setMsg(`✅ Booked! ${data.algorithm} assigned slot: ${data.appointment.scheduledAt ? new Date(data.appointment.scheduledAt).toLocaleString() : "pending"}`);
    refresh();
  };

  return (
    <div className="dash">
      <button className="btn btn-navy" style={{marginBottom:10}} onClick={()=>nav(-1)}>← Back to Dashboard</button>
      <h2 style={{color:"#1A2A56"}}>Book Doctor Appointment</h2>
      <div className="card">
        <h3>Tell us your symptom</h3>
        <input style={{padding:10,width:"60%",marginRight:10}} value={symptom} onChange={e=>setSymptom(e.target.value)} placeholder="e.g., headache" />
        <button className="btn btn-navy" onClick={autoSuggest}>🤖 Ask Bot to Pick Department</button>
        <select value={dept} onChange={e=>setDept(e.target.value)} style={{padding:10,marginTop:14,marginRight:10}}>
          <option>General Physician</option><option>ENT</option><option>Cardiology</option><option>Neurology</option>
          <option>Orthopedics</option><option>Dermatology</option><option>Gastroenterology</option>
        </select>
        
        <div style={{marginTop:15}}>
          <label style={{display:"block", marginBottom:5}}><b>📅 Select Doctor:</b></label>
          <select value={selectedDoctor} onChange={e=>setSelectedDoctor(e.target.value)} style={{padding:10, width:"100%"}}>
            {doctors.length === 0 && <option value="">No doctors available in this department</option>}
            {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
          </select>
        </div>

        <div style={{marginTop:15}}>
          <label style={{display:"block", marginBottom:5}}><b>⏰ Select Timing:</b></label>
          <div style={{display:"flex", gap:10}}>
            <input type="datetime-local" value={time} onChange={e=>setTime(e.target.value)} style={{padding:10, flex:1}} />
            <button 
              className="btn btn-navy" 
              style={{fontSize:12, padding:"0 15px"}}
              onClick={async () => {
                if (!selectedDoctor) return setMsg("❌ Please select a doctor first");
                const { data } = await api.get(`/doctor/${selectedDoctor}/earliest`);
                // Format for datetime-local (YYYY-MM-DDTHH:mm)
                const d = new Date(data.start);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                setTime(d.toISOString().slice(0, 16));
                setMsg(`🤖 Greedy Algorithm suggests: ${new Date(data.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`);
              }}
            >
              🤖 Suggest Earliest (Greedy)
            </button>
          </div>
        </div>

        <div style={{marginTop:20}}>
          <button className="btn" onClick={()=>book("manual")}>Book Manually</button>
          <button className="btn btn-navy" style={{marginLeft:8}} onClick={()=>book("chatbot")}>Book via Chatbot</button>
        </div>
        {msg && <p style={{marginTop:14}}>{msg}</p>}
      </div>

      <div className="card">
        <h3>My Appointments</h3>
        <table>
          <thead><tr><th>Dept</th><th>Doctor</th><th>Scheduled</th><th>Source</th><th>Status</th></tr></thead>
          <tbody>
            {list.map(a=>(
              <tr key={a._id}>
                <td>{a.department}</td>
                <td>{a.doctor?.name || "—"}</td>
                <td>{a.scheduledAt ? new Date(a.scheduledAt).toLocaleString() : "Pending"}</td>
                <td>{a.source}</td>
                <td><span className={`badge ${a.status}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
