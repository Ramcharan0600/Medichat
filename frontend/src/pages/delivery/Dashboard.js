import { useEffect, useState } from "react";
import api from "../../services/api";
import MapVisualizer from "../../components/MapVisualizer";

export default function DeliveryDash() {
  const [avail, setAvail] = useState([]);
  const [mine, setMine] = useState([]);
  const [stats, setStats] = useState({ daily: 0, weekly: 0, monthly: 0, totalEarned: 0, weeklyCount: 0 });
  const refresh = () => {
    api.get("/delivery/available").then(r=>setAvail(r.data));
    api.get("/delivery/mine").then(r=>setMine(r.data));
    api.get("/delivery/stats").then(r=>setStats(r.data));
  };
  useEffect(() => { refresh(); }, []);
  
  const accept = async id => { 
    await api.patch(`/delivery/${id}/accept`); 
    await api.post(`/orders/${id}/route`); // recalculate/ensure route exists
    refresh(); 
  };
  const deliver = async id => { await api.patch(`/delivery/${id}/delivered`); refresh(); };

  const updateProgress = async (id, currentStep, maxSteps) => {
    const next = currentStep + 1;
    if (next < maxSteps) {
      await api.patch(`/delivery/${id}/progress`, { step: next });
      refresh();
    }
  };

  return (
    <div className="dash">
      <h2 style={{color:"#1A2A56", marginBottom: 20}}>🛵 Delivery Intel Dashboard</h2>

      <div style={{display: "grid", gridTemplateColumns: "1fr 400px", gap: 20}}>
        <div>
           <div className="card" style={{borderTop: "4px solid var(--lpu-navy)"}}>
            <h3>🚀 Active Assignments</h3>
            {mine.length === 0 && <p style={{color: "#888", padding: 20}}>You have no active deliveries. Accept an order to start.</p>}
            {mine.map(o=>(
              <div key={o._id} className="card" style={{margin: "15px 0", borderLeft: "4px solid var(--lpu-orange)", background: "#fff"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                   <div>
                      <h4 style={{margin: 0}}>Order #{o._id.slice(-6)}</h4>
                      <p style={{fontSize: 12, color: "#666"}}>{o.student?.name} (BH1) — {o.items?.length} items</p>
                   </div>
                   <span className="badge out_for_delivery">IN TRANSIT</span>
                </div>

                <div style={{marginTop: 20}}>
                   <MapVisualizer path={o.route} currentStep={o.currentStep} />
                </div>

                 {o.altRoute && o.altRoute.length > 0 && (
                   <div style={{marginTop: 15, padding: 12, background: "#fff9f0", borderRadius: 8, border: "1px solid #ffe8cc"}}>
                      <div style={{fontSize: 11, fontWeight: 700, color: "#e67e22", textTransform: "uppercase", marginBottom: 5}}>Algorithm Comparison (Viva Demo)</div>
                      <div style={{display: "flex", gap: 10, fontSize: 12}}>
                         <div style={{flex: 1}}>
                            <div style={{color: "#2ecc71", fontWeight: 700}}>✅ Dijkstra (Shortest)</div>
                            <div>{o.routeDistance} meters</div>
                            <div style={{fontSize: 10, color: "#666"}}>{o.route.join(" → ")}</div>
                         </div>
                         <div style={{width: 1, background: "#eee"}}></div>
                         <div style={{flex: 1}}>
                            <div style={{color: "#e74c3c", fontWeight: 700}}>❌ BFS (Fewest Hops)</div>
                            <div>{o.altRoute.length} steps</div>
                            <div style={{fontSize: 10, color: "#666"}}>{o.altRoute.join(" → ")}</div>
                         </div>
                      </div>
                   </div>
                 )}

                <div style={{marginTop: 15, display: "flex", gap: 10}}>
                   {o.currentStep < o.route.length - 1 ? (
                     <button 
                        className="btn" 
                        style={{flex: 1, height: 45}}
                        onClick={() => updateProgress(o._id, o.currentStep, o.route.length)}
                     >
                        📍 Arrived at {o.route[o.currentStep + 1]}
                     </button>
                   ) : (
                     <button 
                        className="btn" 
                        style={{flex: 1, height: 45, background: "green"}}
                        onClick={() => deliver(o._id)}
                     >
                        ✅ Final Delivery
                     </button>
                   )}
                </div>
              </div>
            ))}
          </div>

          <div className="card">
            <h3>📦 Orders Ready for Pickup</h3>
            {avail.length===0 && <p style={{color: "#888", padding: 10}}>No pharmacy orders are waiting at the moment.</p>}
            {avail.map(o=>(
              <div key={o._id} style={{borderBottom:"1px solid #eee", padding: "12px 0", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <div>
                  <b>#{o._id.slice(-6)}</b> 
                  <div style={{fontSize: 12, color: "#666"}}>To: {o.hostel} | Val: ₹{o.total}</div>
                </div>
                <button className="btn btn-navy" onClick={()=>accept(o._id)}>Accept Mission</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{background: "var(--lpu-navy)", color: "#fff", marginBottom: 20}}>
             <h3 style={{borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10}}>💰 Earnings & Performance</h3>
             <div style={{marginTop: 15}}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: 12}}>
                   <span style={{opacity: 0.8, fontSize: 13}}>Today's Earnings:</span>
                   <b style={{fontSize: 16, color: "var(--lpu-orange)"}}>₹{stats.daily}</b>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: 12}}>
                   <span style={{opacity: 0.8, fontSize: 13}}>Weekly Earnings:</span>
                   <b style={{fontSize: 16}}>₹{stats.weekly}</b>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: 12}}>
                   <span style={{opacity: 0.8, fontSize: 13}}>Monthly Earnings:</span>
                   <b style={{fontSize: 16}}>₹{stats.monthly}</b>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, marginTop: 10}}>
                   <span style={{opacity: 0.8, fontSize: 13}}>Total Payout:</span>
                   <b style={{fontSize: 20, color: "var(--lpu-orange)"}}>₹{stats.totalEarned}</b>
                </div>
             </div>
             
             <div style={{background: "rgba(255,255,255,0.1)", padding: 12, borderRadius: 10, marginTop: 20}}>
                <div style={{fontSize: 11, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1}}>Weekly Productivity</div>
                <div style={{fontSize: 22, fontWeight: 700, marginTop: 5}}>{stats.weeklyCount} Orders</div>
                <div style={{fontSize: 10, opacity: 0.6}}>Keep it up! 🛵</div>
             </div>
          </div>

          <div className="card" style={{background: "#fff", border: "1px solid #eee"}}>
             <h3>💡 Pro Tips</h3>
             <p style={{fontSize: 13, marginBottom: 10, color: "#666"}}>Focus on the Dijkstra path for the most efficient route across LPU.</p>
             <hr style={{opacity: 0.1, margin: "10px 0"}}/>
             <div style={{fontSize: 12, color: "#444"}}>
                <div>🟢 Green: Destination</div>
                <div>🟠 Orange: Your Path</div>
                <div>🛵 Icon: Your Current Spot</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
