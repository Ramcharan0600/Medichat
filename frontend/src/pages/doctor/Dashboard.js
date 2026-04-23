import { useEffect, useState } from "react";
import api from "../../services/api";
export default function DoctorDash() {
  const [list, setList] = useState([]);
  const refresh = () => api.get("/doctor/queue").then(r=>setList(r.data));
  useEffect(() => { refresh(); }, []);
  const accept = async id => { await api.patch(`/doctor/${id}/accept`); refresh(); };
  const reschedule = async id => {
    const { data } = await api.patch(`/doctor/${id}/reschedule`);
    alert(`${data.algorithm} → New slot: ${new Date(data.newSlot.start).toLocaleString()}`);
    refresh();
  };
  const complete = async id => { await api.patch(`/doctor/${id}/complete`); refresh(); };

  return (
    <div className="dash">
      <h2 style={{color:"#1A2A56"}}>👨‍⚕️ Doctor — Appointment Queue</h2>
      <table>
        <thead><tr><th>Student</th><th>Reg No</th><th>Symptoms</th><th>Slot</th><th>Source</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {list.map(a=>(
            <tr key={a._id}>
              <td>{a.student?.name}</td>
              <td>{a.student?.regNo}</td>
              <td>{a.symptoms?.join(", ")}</td>
              <td>{a.scheduledAt ? new Date(a.scheduledAt).toLocaleString() : "—"}</td>
              <td>{a.source}</td>
              <td><span className={`badge ${a.status}`}>{a.status}</span></td>
              <td>
                {a.status==="pending" && <button className="btn" onClick={()=>accept(a._id)}>Accept</button>}
                <button className="btn btn-navy" style={{marginLeft:4}} onClick={()=>reschedule(a._id)}>Reschedule (Greedy)</button>
                <button className="btn btn-outline" style={{marginLeft:4}} onClick={()=>complete(a._id)}>Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
