import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Order() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [meds, setMeds] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({}); // { id: qty }
  const [budget, setBudget] = useState(200);
  const [recoCategory, setRecoCategory] = useState("");
  const [reco, setReco] = useState(null);
  const [msg, setMsg] = useState("");
  const [conflicts, setConflicts] = useState([]);
  
  // New UI States
  const [step, setStep] = useState("cart"); // cart, payment, success
  const [payMethod, setPayMethod] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);

  const refreshItems = () => api.get("/shop/items").then(r => setMeds(r.data));
  useEffect(() => { refreshItems(); }, []);

  useEffect(() => {
    const ids = Object.keys(cart);
    if (ids.length > 1) {
      api.post("/shop/check-conflicts", { itemIds: ids }).then(r => setConflicts(r.data.conflicts));
    } else {
      setConflicts([]);
    }
  }, [cart]);

  const getRecommendation = async () => {
    try {
      const res = await api.post("/orders/recommend", { budget, category: recoCategory });
      setReco(res.data);
    } catch (e) {
      setMsg("❌ Error getting recommendations");
    }
  };

  const filteredMeds = meds.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.category?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (id) => {
    const idStr = String(id);
    setCart(prev => ({ ...prev, [idStr]: (prev[idStr] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    const idStr = String(id);
    const newCart = { ...cart };
    if (newCart[idStr] > 1) newCart[idStr]--;
    else delete newCart[idStr];
    setCart(newCart);
  };

  const handleCheckoutClick = () => {
    if (Object.keys(cart).length === 0) return setMsg("❌ Your cart is empty");
    setStep("payment");
  };

  const place = async () => {
    const items = Object.entries(cart).map(([medicine, qty]) => ({ medicine, qty }));
    setIsProcessing(true);
    setMsg("⏳ Processing secure payment...");
    
    // Simulate payment delay
    setTimeout(async () => {
      try {
        await api.post("/orders", { 
          items, 
          hostel: user?.hostel || "BH1",
          paymentMethod: payMethod 
        });
        setStep("success");
        setCart({});
        setMsg("");
      } catch (e) { 
        setMsg("❌ Error placing order. Please try again."); 
        setStep("cart");
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };

  const cartItems = meds.filter(m => cart[String(m._id)]);
  const totalPrice = cartItems.reduce((acc, m) => acc + (m.price * cart[String(m._id)]), 0);

  const quickRelief = [
    { symptom: "🌡️ Fever", name: "Calpol 650mg", desc: "Best for high fever" },
    { symptom: "🤧 Cold", name: "Solvin Cold", desc: "Relief from flu" },
    { symptom: "🤕 Pain", name: "Saridon Advance", desc: "For headaches" },
    { symptom: "😷 Cough", name: "Ascoril LS Syrup", desc: "Chest congestion" },
  ];

  if (step === "success") {
    return (
      <div className="dash" style={{textAlign:"center", padding: 50}}>
        <div className="card" style={{maxWidth:600, margin:"0 auto", padding:40}}>
           <h1 style={{fontSize: 60}}>✅</h1>
           <h2 style={{color:"var(--lpu-navy)"}}>Order & Payment Successful!</h2>
           <p style={{margin:"20px 0", color:"#666"}}>Your medicines are being packed and will be delivered to <b>{user?.hostel || "BH1"}</b> shortly.</p>
           <div style={{display:"flex", gap:10, justifyContent:"center"}}>
             <button className="btn" onClick={() => nav("/student/track")}>Track My Order</button>
             <button className="btn btn-navy" onClick={() => setStep("cart")}>Buy More</button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dash">
      <button className="btn btn-navy" style={{marginBottom:10}} onClick={()=>nav(-1)}>← Back to Dashboard</button>
      
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20}}>
          <h2 style={{color:"#1A2A56"}}>🏥 Campus Pharmacy — {step === "payment" ? "Secure Checkout" : "Marketplace"}</h2>
      </div>

      {step === "payment" ? (
        <div className="card" style={{maxWidth: 700, margin: "0 auto"}}>
          <button className="btn btn-navy" style={{marginBottom:20}} onClick={()=>setStep("cart")}>← Back to Cart</button>
          <h3>Secure Payment Transfer</h3>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:20}}>
            <div className="card" style={{border: payMethod==="UPI" ? "2px solid var(--lpu-orange)" : "1px solid #eee", cursor:"pointer"}} onClick={()=>setPayMethod("UPI")}>
               <h4>📱 UPI Transfer</h4>
               <p style={{fontSize: 12, color:"#666"}}>Google Pay, PhonePe, Paytm</p>
            </div>
            <div className="card" style={{border: payMethod==="Card" ? "2px solid var(--lpu-orange)" : "1px solid #eee", cursor:"pointer"}} onClick={()=>setPayMethod("Card")}>
               <h4>💳 Credit/Debit Card</h4>
               <p style={{fontSize: 12, color:"#666"}}>Visa, Mastercard, RuPay</p>
            </div>
          </div>

          <div style={{marginTop:30, padding:20, background:"#f9f9f9", borderRadius:10}}>
             <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
                <span>Order Total:</span>
                <b>₹{totalPrice}</b>
             </div>
             <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
                <span>Delivery to:</span>
                <b>{user?.hostel || "BH1"}</b>
             </div>
             
             {payMethod === "UPI" && (
                <div style={{marginTop:20}}>
                   <label style={{fontSize:13, fontWeight:700}}>Enter UPI ID</label>
                   <input placeholder="username@okaxis" style={{width:"100%", padding:12, marginTop:5, borderRadius:8, border:"1px solid #ddd"}} />
                </div>
             )}

             {payMethod === "Card" && (
                <div style={{marginTop:20}}>
                   <label style={{fontSize:13, fontWeight:700}}>Card details</label>
                   <input placeholder="1234 5678 9101 1121" style={{width:"100%", padding:12, marginTop:5, borderRadius:8, border:"1px solid #ddd"}} />
                   <div style={{display:"flex", gap:10, marginTop:10}}>
                      <input placeholder="MM/YY" style={{width:"50%", padding:12, borderRadius:8, border:"1px solid #ddd"}} />
                      <input placeholder="CVV" type="password" style={{width:"50%", padding:12, borderRadius:8, border:"1px solid #ddd"}} />
                   </div>
                </div>
             )}
          </div>

          <button 
            className="btn" 
            style={{width:"100%", marginTop:30, padding:15, fontSize:18, height:60}} 
            disabled={isProcessing}
            onClick={place}
          >
            {isProcessing ? "🔒 Securely Processing..." : `Pay ₹${totalPrice} & Place Order`}
          </button>
          {msg && <p style={{marginTop:15, textAlign:"center", color: msg.includes("⏳") ? "orange" : "red"}}>{msg}</p>}
        </div>
      ) : (
        <>
          {/* Quick Relief Section */}
          <div className="card" style={{background: "linear-gradient(135deg, #fff5f2 0%, #fff 100%)", border: "1px solid #F58220", marginBottom: 25}}>
             <h3 style={{color: "var(--lpu-orange)", marginBottom: 15, display: "flex", alignItems: "center", gap: 8}}>
                ⚡ Quick Relief (Symptom Based)
             </h3>
             <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12}}>
                {quickRelief.map(q => {
                   const med = meds.find(m => m.name === q.name);
                   return (
                      <div key={q.symptom} style={{background: "#fff", padding: 12, borderRadius: 10, boxShadow: "0 2px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                         <div style={{marginBottom: 8}}>
                            <span style={{fontSize: 10, fontWeight: 700, color: "var(--lpu-navy)", background:"#eef2ff", padding:"2px 6px", borderRadius:4}}>{q.symptom}</span>
                            <h4 style={{margin: "4px 0", fontSize: 15}}>{q.name}</h4>
                            <p style={{fontSize: 11, color: "#666"}}>{q.desc}</p>
                         </div>
                         <button 
                            className="btn" 
                            style={{padding: "6px", fontSize: 13, width: "100%", background: "var(--lpu-navy)"}} 
                            onClick={() => med && addToCart(med._id)}
                            disabled={!med}
                         >
                            {med ? "+ Add" : "Out of Stock"}
                         </button>
                      </div>
                   );
                })}
             </div>
          </div>

          {/* Smart Budget Assistant (DSA Integration) */}
          <div className="card" style={{border: "2px dashed var(--lpu-navy)", marginBottom: 25, background: "#f8fbff"}}>
             <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20}}>
                <div style={{flex: 1, minWidth: 300}}>
                   <h3 style={{color: "var(--lpu-navy)", display: "flex", alignItems: "center", gap: 8}}>
                      🤖 Smart Budget Assistant (DSA)
                   </h3>
                   <p style={{fontSize: 13, color: "#555", marginTop: 5}}>
                      Using <b>0/1 Knapsack (Dynamic Programming)</b>, I'll find the best combination of medicines to maximize your recovery benefit within your budget.
                   </p>
                   
                   <div style={{display: "flex", gap: 10, marginTop: 15, alignItems: "flex-end"}}>
                      <div style={{flex: 1}}>
                         <label style={{fontSize: 12, fontWeight: 700}}>Budget (₹)</label>
                         <input 
                            type="number" 
                            className="input" 
                            style={{padding: 8}} 
                            value={budget || ""} 
                            min="200"
                            onChange={e => {
                               const val = e.target.value;
                               setBudget(val === "" ? 0 : Number(val));
                            }} 
                         />
                      </div>
                      <div style={{flex: 1}}>
                         <label style={{fontSize: 12, fontWeight: 700}}>Target Disorder/Category</label>
                         <select 
                            className="input" 
                            style={{padding: 8}}
                            value={recoCategory}
                            onChange={e => setRecoCategory(e.target.value)}
                         >
                            <option value="">All Categories</option>
                            <option value="Fever">Fever</option>
                            <option value="Cold & Flu">Cold & Flu</option>
                            <option value="Headache/Pain">Headache/Pain</option>
                            <option value="Cough">Cough</option>
                            <option value="Acidity/Gas">Acidity/Gas</option>
                            <option value="Allergy">Allergy</option>
                            <option value="Muscle Pain">Muscle Pain</option>
                         </select>
                      </div>
                      <button className="btn btn-navy" style={{padding: "10px 20px"}} onClick={getRecommendation}>Optimize</button>
                   </div>
                </div>

                {reco && (
                   <div className="card" style={{flex: 1, minWidth: 300, background: "#fff", border: "1px solid #dbeafe"}}>
                      <h4 style={{margin: 0, color: "var(--lpu-orange)", fontSize: 14}}>Optimization Result ({reco.algorithm})</h4>
                      <div style={{margin: "10px 0"}}>
                         {reco.chosen.length > 0 ? (
                            <>
                               <div style={{fontSize: 12, color: "#666", marginBottom: 8}}>Best combination for ₹{budget}:</div>
                               {reco.chosen.map(it => (
                                  <div key={it._id} style={{display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #f0f0f0"}}>
                                     <span>{it.name}</span>
                                     <b>₹{it.price}</b>
                                  </div>
                               ))}
                               <div style={{marginTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 700}}>
                                  <span>Total Spent:</span>
                                  <span>₹{reco.spent}</span>
                                </div>
                               <button 
                                  className="btn" 
                                  style={{width: "100%", marginTop: 10, padding: 8, fontSize: 12}}
                                  onClick={() => {
                                     reco.chosen.forEach(it => addToCart(it._id));
                                     setReco(null);
                                  }}
                               >
                                  🛒 Add All to Cart
                               </button>
                            </>
                         ) : (
                            <p style={{fontSize: 13, color: "red"}}>Budget too low for this category.</p>
                         )}
                      </div>
                   </div>
                )}
             </div>
          </div>

          <div style={{display:"grid", gridTemplateColumns: "1fr 340px", gap: 20}}>
            <div className="card">
              <div style={{display:"flex", gap:10, marginBottom:16}}>
                <input 
                  placeholder="🔍 Search all medicines or symptoms..." 
                  style={{padding:12, flex:1, border:"1px solid #ddd", borderRadius:8}} 
                  value={search} 
                  onChange={e=>setSearch(e.target.value)}
                />
              </div>

              <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(180px, 1fr))", gap:15}}>
                {filteredMeds.map(m => (
                  <div key={String(m._id)} className="feature-card" style={{borderTop: "3px solid var(--lpu-orange)", padding:15}}>
                    <div style={{background: "var(--lpu-orange)", color: "#fff", fontSize: 10, padding: "2px 8px", borderRadius: 4, width: "fit-content", marginBottom: 8, fontWeight: 700}}>
                       {m.category?.toUpperCase()}
                    </div>
                    <h4 style={{color:"var(--lpu-navy)", fontSize: 16}}>{m.name}</h4>
                    <p style={{fontWeight:700, margin:"10px 0", fontSize:18}}>₹{m.price}</p>
                    <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                       <span style={{fontSize:11, color: m.stock < 10 ? "red" : "green"}}>Stock: {m.stock}</span>
                       <button className="btn" style={{padding:"5px 12px", fontSize:12}} onClick={()=>addToCart(m._id)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Column */}
            <div className="card" style={{position:"sticky", top:20, height:"fit-content", borderLeft:"4px solid var(--lpu-navy)"}}>
              <h3>🛒 Your Cart</h3>
              
              {conflicts.length > 0 && (
                 <div style={{background: "#fff5f5", border: "1px solid #feb2b2", padding: 12, borderRadius: 8, marginBottom: 15}}>
                    <div style={{color: "#c53030", fontWeight: 700, fontSize: 13, marginBottom: 5}}>⚠️ Safety Warning (DSA Checker)</div>
                    {conflicts.map((c, i) => (
                      <div key={i} style={{fontSize: 11, color: "#742a2a", marginBottom: 5}}>
                         <b>{c.pair.join(" + ")}:</b> {c.reason}
                      </div>
                    ))}
                 </div>
              )}

              <div style={{maxHeight: 400, overflowY: "auto", margin: "15px 0"}}>
                {cartItems.length === 0 && <p style={{color:"#999", textAlign:"center", padding:20}}>Cart is empty</p>}
                {cartItems.map(m => (
                  <div key={String(m._id)} style={{display:"flex", justifyContent:"space-between", marginBottom:10, paddingBottom:10, borderBottom:"1px solid #eee"}}>
                    <div>
                      <div style={{fontSize:14, fontWeight:600}}>{m.name}</div>
                      <div style={{fontSize:12, color:"#666"}}>₹{m.price} x {cart[String(m._id)]}</div>
                    </div>
                    <div style={{display:"flex", gap:5, alignItems:"center"}}>
                      <button className="btn btn-navy" style={{padding:"2px 8px"}} onClick={()=>removeFromCart(m._id)}>-</button>
                      <button className="btn btn-navy" style={{padding:"2px 8px"}} onClick={()=>addToCart(m._id)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{borderTop:"2px solid #eee", paddingTop:15}}>
                 <div style={{display:"flex", justifyContent:"space-between", fontWeight:700, fontSize:18, marginBottom:15}}>
                    <span>Total:</span>
                    <span style={{color:"var(--lpu-orange)"}}>₹{totalPrice}</span>
                 </div>
                 <button className="btn" style={{width:"100%", padding:14, fontSize:16}} onClick={handleCheckoutClick} disabled={cartItems.length===0}>Checkout Now</button>
                 {msg && <p style={{marginTop:10, textAlign:"center", fontSize:13, color: "red"}}>{msg}</p>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
