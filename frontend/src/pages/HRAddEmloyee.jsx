import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

const HRAddEmployee = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [status, setStatus] = useState(null);

  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.post(`${API_URL}departments`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}addNewUser`,
        {
          username,
          password,
          role: "employee", // hardcoded role
          avatar: avatar === null ? "" : avatar,
          dept_id: department,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.type === "success") {
        setUsername("");
        setAvatar("");
        setPassword("");
        setDepartment("");
        setStatus(true);
      }
    } catch (error) {
      console.error(error);
      setStatus(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result.split(",")[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      {status !== null && (
        <div
          className={`p-4 mb-4 rounded ${
            status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {status ? "Employee added successfully" : "Failed to add employee"}
        </div>
      )}
      <h2 className="text-2xl font-semibold text-[#260058] mb-6">
        Add New Employee
      </h2>
      <form onSubmit={handleAddEmployee} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Avatar
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#260058]"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#260058]"
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#260058]"
            placeholder="Enter password"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#260058]"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept, i) => (
              <option key={i} value={dept.dept_id}>
                {dept.dept_name}
              </option>
            ))}
          </select>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-[#260058] text-white px-5 py-2 rounded hover:bg-[#3e0091] transition"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  );
};

export default HRAddEmployee;
