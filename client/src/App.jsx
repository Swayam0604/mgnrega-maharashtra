import React, { useEffect } from "react";
import { useDistrictStore } from "./stores/districtStore";
import DistrictPicker from "./components/DistrictPicker";
import Dashboard from "./components/Dashboard";
import axios from "axios";

function App() {
  const { selectedDistrict, setDistricts } = useDistrictStore();

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/districts/")
      .then((res) => setDistricts(res.data.results || res.data))
      .catch((err) => console.error("Failed to fetch districts:", err));
  }, [setDistricts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!selectedDistrict ? <DistrictPicker /> : <Dashboard />}
    </div>
  );
}

export default App;
