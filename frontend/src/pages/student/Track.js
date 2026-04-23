import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MapVisualizer from "../../components/MapVisualizer";

export default function Track() {
  const nav = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get("/orders/mine")
      .then(r => setOrders(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchOrders();
    const interval = setInterval(fetchOrders, 4000); // Poll every 4 seconds for "Zomato-style" updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dash">
      <button className="btn btn-navy" style={{marginBottom:10}} onClick={()=>nav(-1)}>← Back to Dashboard</button>
      <h2 style={{color:"#1A2A56", marginBottom: 20}}>📦 Live Pharmacy Tracker</h2>
      
      {loading ? (
        <p>Connecting to campus delivery network...</p>
      ) : orders.length === 0 ? (
        <div className="card" style={{textAlign:"center", padding:40}}>
           <h3 style={{color:"#999"}}>No active orders found.</h3>
           <button className="btn" style={{marginTop:15}} onClick={()=>nav("/student/order")}>Start Shopping</button>
        </div>
      ) : (
        <div style={{display:"grid", gap: 20}}>
          {orders.map(o => (
            <div className="card" key={o._id} style={{borderLeft:"4px solid var(--lpu-orange)", padding: 0, overflow: "hidden"}}>
              <div style={{padding: 20}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                  <div>
                      <h3 style={{margin:0}}>Order #{o._id.slice(-6)}</h3>
                      <p style={{fontSize:12, color:"#666"}}>{o.status === "delivered" ? "✅ Completed" : "🛵 In Transit"}</p>
                  </div>
                  <span className={`badge ${o.status}`} style={{fontSize:12}}>{o.status.toUpperCase()}</span>
                </div>
              </div>

              {o.route && o.route.length > 0 && o.status !== "delivered" && (
                <div style={{padding: "0 20px 20px 20px"}}>
                   <MapVisualizer path={o.route} currentStep={o.currentStep} />
                   
                   {/* Progress Timeline */}
                   <div style={{marginTop: 20, position: "relative"}}>
                      <div style={{
                        display: "flex", 
                        justifyContent: "space-between", 
                        marginBottom: 10,
                        position: "relative",
                        padding: "0 10px"
                      }}>
                        {o.route.map((node, idx) => (
                           <div key={idx} style={{flex: 1, textAlign: "center", position: "relative"}}>
                              <div style={{
                                width: 12, height: 12, borderRadius: "50%", 
                                background: idx <= o.currentStep ? "var(--lpu-orange)" : "#cbd5e1",
                                margin: "0 auto", border: "2px solid #fff", zIndex: 2, position: "relative"
                              }}></div>
                              {idx < o.route.length - 1 && (
                                <div style={{
                                  position: "absolute", top: 5, left: "50%", width: "100%", height: 2,
                                  background: idx < o.currentStep ? "var(--lpu-orange)" : "#cbd5e1",
                                  zIndex: 1
                                }}></div>
                              )}
                              <p style={{fontSize: 9, marginTop: 5, color: idx <= o.currentStep ? "#1a2a56" : "#94a3b8", fontWeight: idx === o.currentStep ? 700 : 400}}>
                                {node}
                              </p>
                           </div>
                        ))}
                      </div>
                   </div>

                   <div style={{marginTop:15, padding:15, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 15}}>
                      <div style={{fontSize: 24, background: "#fff", width: 50, height: 50, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)"}}>
                        🛵
                      </div>
                      <div style={{flex: 1}}>
                         <h4 style={{color: "var(--lpu-navy)", margin: 0, fontSize: 14}}>Live Progress</h4>
                         <p style={{fontSize: 12, color:"#666", marginTop:2}}>
                            {o.currentStep === 0 ? "Agent just picked up your order!" : 
                             o.currentStep === o.route.length - 1 ? "Agent has arrived at your hostel!" : 
                             `Approaching ${o.route[o.currentStep + 1]}...`}
                         </p>
                      </div>
                      <div style={{textAlign: "right"}}>
                         <span className="badge" style={{background: "var(--lpu-navy)", color: "#fff", fontSize: 10}}>
                            {o.route.length - o.currentStep - 1} stops left
                         </span>
                      </div>
                   </div>
                </div>
              )}

              <div style={{padding: 20, background: "#f1f5f9", borderTop: "1px solid #e2e8f0"}}>
                 <p style={{fontSize: 13}}><b>Items:</b> {o.items.map(i => `${i.medicine?.name || "Unknown"} (x${i.qty})`).join(", ")}</p>
                 <p style={{fontSize: 13, marginTop: 5}}><b>Destination:</b> {o.hostel} Hostel</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
