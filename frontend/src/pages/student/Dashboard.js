import { Link } from "react-router-dom";
export default function StudentDash() {
  return (
    <div className="dash">
      <h2 style={{color:"#1A2A56",marginBottom:20}}>Student Dashboard</h2>
      <div className="dash-grid">
        <Link to="/student/chat"><div className="feature-card"><h3>🤖 AI Doctor Chat</h3><p>Describe your symptoms — BFS/DFS routes you to the right department.</p></div></Link>
        <Link to="/student/order"><div className="feature-card"><h3>💊 Order Medicines</h3><p>Browse and order — Knapsack DP suggests best combos within budget.</p></div></Link>
        <Link to="/student/book"><div className="feature-card"><h3>📅 Book Appointment</h3><p>Manual or chatbot-driven, auto-scheduled with Greedy slot picker.</p></div></Link>
        <Link to="/student/track"><div className="feature-card"><h3>🛵 Track Orders</h3><p>See delivery route on LPU campus graph (Dijkstra).</p></div></Link>
      </div>
    </div>
  );
}
