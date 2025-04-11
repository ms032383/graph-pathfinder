# 🧠 Dijkstra & A* Pathfinding Visualizer

This project is a fully interactive **pathfinding visualizer** built with **React.js** and **React Flow**. It allows users to dynamically create graphs, select start and end nodes, and visualize how Dijkstra's and A* algorithms find the shortest path.

---

## 🚀 Features

- 📍 **Add Nodes & Edges** with custom weights
- 🧠 **Choose Algorithms**: Dijkstra, A*
- 🧭 **Visualize Visited Nodes** step-by-step
- 🔄 **Undo/Redo** for safe experimentation
- 🧹 **Reset Graph** or Load a Template
- 🧾 **Result Panel** shows distance and path
- 💻 **Responsive UI** with fixed control toolbar

---

## 📸 Screenshots

![image](https://github.com/user-attachments/assets/c7e0d1a3-e4ab-4851-ac54-0d28177238bc)


---

## 🛠 Tech Stack

- **React.js** (with Hooks)
- **React Flow** for dynamic graph interaction
- **CSS + Inline Styles**
- Optional deployment via **Vercel**, **Netlify**, or **GitHub Pages**

---

## 📂 Folder Structure

```
src/
├── components/
│   └── CustomFlow.js        # Main graph interaction UI
├── utils/
│   ├── dijkstra.js          # Dijkstra algorithm logic
│   ├── aStar.js             # A* algorithm with heuristic
│   └── bellmanFord.js       # Optional: Bellman-Ford implementation
├── App.js
└── index.js
```

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/yourusername/pathfinding-visualizer.git
cd pathfinding-visualizer
npm install
npm start
```
Then visit: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

You can deploy it easily using:

### 🟢 Vercel (Recommended)
- Push to GitHub
- Go to [https://vercel.com]([[https://vercel.com](https://graph-pathfinder.vercel.app)])
- Import project → Set `build` as output directory

### 🔵 Netlify
- Drag-and-drop build folder or link GitHub repo

---

## 📚 How A* Differs from Dijkstra

- Dijkstra explores nodes based only on **shortest known cost**.
- A* uses both known cost + a **heuristic** (estimated cost to goal).
- Our heuristic: scaled Euclidean distance using node positions (can be turned off).

---

## 👨‍💻 Author

**Mohan Singh**  
[GitHub Profile](https://github.com/ms032383)  


---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

