import { useEffect, useState } from "react";
import api from "../../services/api";

export default function ShopDash() {
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("orders");
  
  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ price: 0, stock: 0 });

  const refreshOrders = () => api.get("/orders/shop").then(r=>setOrders(r.data));
  const refreshInventory = () => api.get("/shop/inventory").then(r=>setInventory(r.data));
  const refreshStats = () => api.get("/shop/stats").then(r=>setStats(r.data));

  useEffect(() => { 
    refreshOrders();
    refreshInventory();
    refreshStats();
  }, []);

  const pack = async id => { await api.patch(`/orders/${id}/pack`); refreshOrders(); refreshStats(); };
  
  const computeRoute = async id => {
    const { data } = await api.post(`/orders/${id}/route`);
    alert(`🛵 Dijkstra Optimal Path: ${data.path.join(" → ")}\nTotal Distance: ${data.distance}m`);
    refreshOrders();
  };

  const isExpiringSoon = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = (d - now) / (1000 * 60 * 60 * 24);
    return diff < 30;
  };

  const startEdit = (m) => {
    setEditingId(m._id);
    setEditForm({ price: m.price, stock: m.stock });
  };

  const saveEdit = async () => {
    try {
      await api.patch(`/shop/medicine/${editingId}`, editForm);
      setEditingId(null);
      refreshInventory();
      refreshStats();
    } catch (e) {
      alert("Error updating medicine");
    }
  };

  return (
    <div className="dash">
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
        <h2 style={{color:"#1A2A56"}}>🏪 LPU Chemist — Management Portal</h2>
        <div className="tabs" style={{display:"flex", gap:10}}>
          <button className={`btn ${tab==="orders"?"":"btn-navy"}`} onClick={()=>setTab("orders")}>📦 Orders</button>
          <button className={`btn ${tab==="inventory"?"":"btn-navy"}`} onClick={()=>setTab("inventory")}>💊 Inventory</button>
          <button className={`btn ${tab==="stats"?"":"btn-navy"}`} onClick={()=>setTab("stats")}>📊 Analytics</button>
        </div>
      </div>

      {stats && (
        <div className="dash-grid" style={{marginBottom:24}}>
          <div className="feature-card" style={{borderTopColor:"#065f46"}}>
            <h3>₹ {stats.totalInventoryValue}</h3>
            <p>Total Inventory Value</p>
          </div>
          <div className="feature-card" style={{borderTopColor:"#F58220"}}>
            <h3>{stats.requestedCount}</h3>
            <p>Requested (New Orders)</p>
          </div>
          <div className="feature-card" style={{borderTopColor:"#2c4380"}}>
            <h3>{stats.totalSold}</h3>
            <p>Total Medicines Sold</p>
          </div>
          <div className="feature-card" style={{borderTopColor: stats.expiringSoon > 0 ? "#ff4444" : "#065f46" }}>
            <h3 style={{color: stats.expiringSoon > 0 ? "#ff4444" : "inherit"}}>{stats.expiringSoon}</h3>
            <p>Expiring Within 30 Days</p>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="card">
          <h3>Active Order Queue</h3>
          <table>
            <thead><tr><th>Order #</th><th>Student</th><th>Hostel</th><th>Items</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {orders.map(o=>(
                <tr key={o._id}>
                  <td>{o._id.slice(-6)}</td>
                  <td>{o.student?.name}</td>
                  <td>{o.hostel}</td>
                  <td>{o.items.map(i=>`${i.medicine?.name} x${i.qty}`).join(", ")}</td>
                  <td><span className={`badge ${o.status}`}>{o.status}</span></td>
                  <td>
                    {o.status==="placed" && <button className="btn" onClick={()=>pack(o._id)}>Mark Packed</button>}
                    <button className="btn btn-navy" style={{marginLeft:6}} onClick={()=>computeRoute(o._id)}>View Route (Dijkstra)</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "inventory" && (
        <div className="card">
          <h3>Medicine Inventory & Stock Management</h3>
          <table>
            <thead><tr><th>Medicine Name</th><th>Category</th><th>Price (₹)</th><th>Stock</th><th>Sold</th><th>Expiry Date</th><th>Actions</th></tr></thead>
            <tbody>
              {inventory.map(m=>(
                <tr key={m._id} style={{background: isExpiringSoon(m.expiryDate) ? "#fff5f5" : "inherit"}}>
                  <td><b>{m.name}</b></td>
                  <td>{m.category}</td>
                  <td>
                    {editingId === m._id ? (
                      <input 
                        type="number" 
                        value={editForm.price} 
                        style={{width: 60, padding: 4}}
                        onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} 
                      />
                    ) : (
                      `₹${m.price}`
                    )}
                  </td>
                  <td style={{color: m.stock < 20 ? "red" : "inherit"}}>
                    {editingId === m._id ? (
                      <input 
                        type="number" 
                        value={editForm.stock} 
                        style={{width: 60, padding: 4}}
                        onChange={e => setEditForm({...editForm, stock: Number(e.target.value)})} 
                      />
                    ) : (
                      m.stock
                    )}
                  </td>
                  <td>{m.soldCount}</td>
                  <td>{new Date(m.expiryDate).toLocaleDateString()}</td>
                  <td>
                    {editingId === m._id ? (
                      <button className="btn" style={{padding: "4px 8px", fontSize: 11}} onClick={saveEdit}>Save</button>
                    ) : (
                      <button className="btn btn-navy" style={{padding: "4px 8px", fontSize: 11}} onClick={() => startEdit(m)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "stats" && stats && (
        <div className="card">
          <h3>Performance Insights</h3>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:10}}>
            <div className="card" style={{background:"#f9f9f9"}}>
              <h4>Inventory Health</h4>
              <p style={{fontSize:14, marginTop:10}}>Total Items: {inventory.length}</p>
              <p style={{fontSize:14}}>Low Stock Alerts: {stats.lowStockCount}</p>
              <p style={{fontSize:14}}>Critical Expiry: {stats.expiringSoon}</p>
            </div>
            <div className="card" style={{background:"#f9f9f9"}}>
              <h4>Sales Performance</h4>
              <p style={{fontSize:14, marginTop:10}}>Lifetime Sales Volume: {stats.totalSold} units</p>
              <p style={{fontSize:14}}>Current Market Demand: {stats.requestedCount} pending items</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
