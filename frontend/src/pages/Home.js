import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Calm<span>Cure</span> LPU</h1>
        <p>Medicine delivery, AI doctor chat & appointment booking — exclusively for Lovely Professional University.</p>
        <Link to="/register"><button className="btn">Get Started</button></Link>
        <Link to="/login"><button className="btn btn-outline" style={{marginLeft:12, background:"#fff"}}>Login</button></Link>
      </section>
      <div className="dash">
        <div className="dash-grid">
          <div className="feature-card"><h3>🤖 AI Doctor Chat</h3><p>Powered by BFS/DFS symptom-tree traversal — get instant department recommendation.</p></div>
          <div className="feature-card"><h3>💊 Order Medicines</h3><p>Hostel delivery via Dijkstra's shortest path. Knapsack DP recommends best combos within budget.</p></div>
          <div className="feature-card"><h3>📅 Book Appointments</h3><p>Greedy earliest-slot scheduler auto-assigns you to the next available doctor.</p></div>
          <div className="feature-card"><h3>🛵 Track Delivery</h3><p>Real-time order status across the LPU campus graph.</p></div>
        </div>
      </div>
    </>
  );
}
