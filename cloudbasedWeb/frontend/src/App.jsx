import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function App() {
  const [reports, setReports] = useState([]);
  const [summary, setSummary] = useState({ totalKg: 0, byCategory: [] });
  const [form, setForm] = useState({ userName: '', category: 'Produce', quantityKg: 0.5, description: '' });

  const fetchReports = async () => {
    const res = await axios.get(`${API_BASE}/api/reports`);
    setReports(res.data);
    const s = await axios.get(`${API_BASE}/api/reports/summary`);
    setSummary(s.data);
  };

  useEffect(() => { fetchReports(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await axios.post(`${API_BASE}/api/reports`, {
      userName: form.userName,
      category: form.category,
      quantityKg: Number(form.quantityKg),
      description: form.description,
    });
    setForm({ ...form, quantityKg: 0.5, description: '' });
    await fetchReports();
  };

  return (
    <div className="container">
      <h1>Food Waste Guardian</h1>
      <p>Track food waste events, get insight to reduce emissions and costs.</p>

      <section className="card">
        <h2>Report Waste</h2>
        <form onSubmit={submit}>
          <input value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} required placeholder="Your Name" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option>Produce</option>
            <option>Cooked Food</option>
            <option>Bakery</option>
            <option>Meals</option>
            <option>Other</option>
          </select>
          <input type="number" step="0.1" value={form.quantityKg} onChange={(e) => setForm({ ...form, quantityKg: e.target.value })} required placeholder="Kilograms" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" />
          <button type="submit">Submit</button>
        </form>
      </section>

      <section className="card">
        <h2>Impact Summary</h2>
        <div>Total waste: {summary.totalKg.toFixed(2)} kg</div>
        <ul>{summary.byCategory.map((row) => <li key={row.category}>{row.category}: {row.totalKg.toFixed(2)} kg</li>)}</ul>
      </section>

      <section className="card">
        <h2>Recent Reports</h2>
        <table>
          <thead><tr><th>User</th><th>Category</th><th>Kg</th><th>Description</th><th>Time</th></tr></thead>
          <tbody>{reports.map((r) => <tr key={r.id}><td>{r.user_name}</td><td>{r.category}</td><td>{r.quantity_kg}</td><td>{r.description}</td><td>{new Date(r.created_at).toLocaleString()}</td></tr>)}</tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
