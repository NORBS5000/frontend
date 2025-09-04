import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !password) {
      setError("Please provide both PDF file and password");
      return;
    }

    setLoading(true);
    setError("");
    setData([]);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "http://localhost:8000/decrypt-parse-statement/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Response contains parsed JSON
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to decrypt/parse PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (data.length === 0) return;

    // Convert JSON to CSV
    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map(row => headers.map(h => `"${row[h]}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bank_statement.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Decrypt & Parse Bank Statement PDF
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white p-6 rounded shadow"
      >
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Encrypted PDF File</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Processing..." : "Decrypt & Parse"}
        </button>
      </form>

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}

      {data.length > 0 && (
        <div className="mt-6 max-w-4xl mx-auto overflow-x-auto">
          <button
            onClick={handleDownloadExcel}
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download as CSV
          </button>
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="border px-2 py-1 text-left">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* {data.map((row, idx) => (
                <tr key={idx} className="even:bg-gray-50">
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border px-2 py-1">
                      {val}
                    </td>
                  ))}
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
