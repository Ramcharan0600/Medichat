# 🏥 LPUCure — AI-Powered Campus Medical Service Platform

**LPUCure** is a comprehensive MERN-stack medical service ecosystem designed specifically for the students and staff of Lovely Professional University (LPU). It integrates **Artificial Intelligence** and **6 Advanced Data Structures & Algorithms (DSA)** to solve real-world healthcare and logistical challenges on a massive campus.

---

## 🚀 Core Features

### 👨‍🎓 For Students
*   **AI Symptom Checker:** Get instant department suggestions using BFS/DFS traversal.
*   **Marketplace:** Buy medicines with a **Smart Budget Assistant** (Knapsack DP).
*   **Safety First:** Real-time **Drug Interaction Checker** to prevent harmful medicine combinations.
*   **Live Tracking:** Follow your delivery agent on a Dijkstra-optimized campus map.
*   **Appointment Booking:** Greedy-based scheduling for the earliest available doctor slots.

### 🛵 For Delivery Agents
*   **Route Optimization:** Dijkstra-based shortest path navigation between campus hubs.
*   **Path Comparison:** Side-by-side view of Dijkstra (Shortest Distance) vs BFS (Fewest Hops).
*   **Earnings Analytics:** Track daily, weekly, and monthly productivity and income.

### 🏥 For Doctors & Shops
*   **Digital Prescription:** Automated appointment management.
*   **Inventory Intelligence:** Track low stock, expiring medicines, and total sales.

---

## 🧠 DSA Implementations (The Core Intelligence)

This project stands out by moving beyond simple CRUD, using 6 distinct algorithms:

| Feature | Algorithm | Purpose | Complexity |
| :--- | :--- | :--- | :--- |
| **Delivery Routing** | **Dijkstra's** | Shortest physical distance across campus. | $O((V+E) \log V)$ |
| **Budget Optimizer** | **0/1 Knapsack** | Maximize health benefit within a student's budget. | $O(n \cdot W)$ |
| **Slot Scheduling** | **Greedy Algo** | Finds the earliest 15-minute gap in doctor's day. | $O(n \log n)$ |
| **Route Comparison** | **BFS** | Finds the path with minimum buildings (hops). | $O(V + E)$ |
| **Diagnosis Bot** | **BFS / DFS** | Traverses a Symptom-to-Department tree. | $O(V + E)$ |
| **Safety Checker** | **Pairwise Search** | Detects harmful drug-to-drug interactions in cart. | $O(n^2)$ |

---

## 🛠️ Technology Stack

### Frontend (The Interface)
- **React.js (v18)**: Powering a highly dynamic and responsive Single Page Application.
- **Context API**: Managing global state for authentication and user sessions.
- **Leaflet & React-Leaflet**: Visualizing the Dijkstra-optimized campus map and real-time tracking.
- **Axios**: Handling asynchronous API communication with custom interceptors.
- **Vanilla CSS3**: Tailored premium aesthetics with a university-themed (Navy & Orange) design system.

### Backend (The Engine)
- **Node.js & Express.js**: Providing a robust and scalable RESTful API architecture.
- **Mongoose**: Modeling complex healthcare relationships (Students, Doctors, Shops, Orders).
- **JWT (JSON Web Tokens)**: Secure, stateless authentication.
- **Bcryptjs**: Advanced hashing for user password protection.

### Database & AI
- **MongoDB Atlas**: Cloud-hosted NoSQL database for global data persistence.
- **Google Gemini Pro**: Integrated for advanced natural language symptom analysis and sympathetic responses.

### Session Management
- **Persistent Sessions**: Upgraded from `sessionStorage` to `localStorage` to ensure user data remains active even after closing the browser—aligned with real-world healthcare application standards.

---

## 🗺️ Campus Graph Nodes
The system uses a real-world mapped graph of LPU landmarks:
`Chemist`, `UniMall`, `Block 34`, `BH1`, `BH2`, `BH3`, `BH4`, `BH5`, `GH1`, `GH2`, `GH3`.

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create .env with MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
   node scripts/seed.js  # Crucial: Seeds the DSA Campus Graph and Mappings
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

---

## 👨‍🏫 Demo Credentials
*   **Student:** `student@lpu.in` / `demo1234`
*   **Shop:** `shop@lpu.in` / `demo1234`
*   **Delivery:** `delivery@lpu.in` / `demo1234`
*   **Doctor:** `doctor@lpu.in` / `demo1234`

---

---

## 🎓 Key Learnings from this Project

Building **CalmCure LPU** was a deep dive into complex system architecture and real-world problem-solving:

- **DSA in Production**: Learned to move beyond theoretical algorithm problems by implementing **Dijkstra’s**, **Knapsack**, and **Graph traversals** to solve actual campus logistics and healthcare diagnostics.
- **Full-Stack Orchestration**: Mastered the integration of a MERN-stack environment, handling everything from role-based access control (RBAC) to cloud database persistence.
- **Empathy-Driven UX**: Discovered the importance of "tone" in AI interactions, refining the chatbot from a dry diagnostic tool into a sympathetic health assistant.
- **Session Persistence**: Tackled real-world session management challenges, understanding the trade-offs between `sessionStorage` and `localStorage` for user retention.
- **Geospatial Logic**: Gained experience in mapping real-world coordinates and visualizing algorithm results through interactive map layers.

---

## 📄 License
This project was developed for the LPU Final Year Project/DSA Viva and is open-source.

