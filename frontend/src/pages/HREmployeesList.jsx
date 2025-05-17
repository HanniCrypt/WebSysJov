import axios from "axios";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost/emsystem/backend/index.php?action=";

function HREmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editModal, setEditModal] = useState(false);

  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const fetchDepartments = async () => {
    try {
      const response = await axios.post(`${API_URL}departments`);

      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };
  const fetchAllEmployees = async () => {
    const response = await axios.post(`${API_URL}fetchAllEmployees`);

    setEmployees(response.data);
  };

  useEffect(() => {
    fetchAllEmployees();
    fetchDepartments();
  }, []);

  const handleDelete = async (user_id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await axios.post(
          `${API_URL}removeEmployee`,
          {
            user_id: user_id,
          },
          { withCredentials: true }
        );

        if (response.data.type === "success") {
          alert(response.data.message);
          fetchAllEmployees();
        } else {
          alert(response.data.message);
          fetchAllEmployees();
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Failed to delete employee");
      }
    }
  };

  const handleEditModal = async (employee) => {
    setEditModal(true);
    setSelectedEmployee(employee);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedEmployee((prev) => ({
          ...prev,
          avatar: reader.result.split(",")[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditEmployee = async (e) => {
    e.preventDefault();

    await axios.post(
      `${API_URL}updateEmployee`,
      {
        user_id: selectedEmployee.user_id,
        avatar: selectedEmployee.avatar,
        username: selectedEmployee.username,
        newPass: selectedEmployee.password,
        dept_id: selectedEmployee.dept_id,
      },
      { withCredentials: true }
    );

    setEditModal(false);
    fetchAllEmployees();
  };

  return (
    <div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4"> EMPLOYEES</h1>

        <div className="flex justify-around">
          <div className="mb-4">
            <label htmlFor="departmentFilter" className="mr-2 font-semibold">
              Filter by Department:
            </label>
            <select
              id="departmentFilter"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border px-2 py-1 rounded"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_name}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">avatar</th>
              <th className="border p-2">user_id</th>
              <th className="border p-2">username</th>
              <th className="border p-2">Department</th>
              <th className="border p-2">created_at</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees?.filter(
                (user) =>
                  (selectedDepartment
                    ? user.dept_name === selectedDepartment
                    : true)
              ).map((employee) => (
              <tr key={employee.user_id}>
                <td className="border p-2 ">
                  <div className="flex justify-center items-center">
                    {employee.avatar ? (
                      <img
                        src={`data:image/jpeg;base64,${employee.avatar}`}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      "No Avatar"
                    )}
                  </div>
                </td>
                <td className="border p-2">{employee.user_id}</td>
                <td className="border p-2">{employee.username}</td>
                <td className="border p-2">{employee?.dept_name}</td>
                <td className="border p-2">{employee.created_at}</td>
                <td className="border p-2 ">
                  <div className="flex gap-5 items-center justify-center">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 cursor-pointer"
                      onClick={() =>
                        handleEditModal({ ...employee, password: "" })
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
                      onClick={() => handleDelete(employee.user_id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center ${
          editModal ? "" : "hidden"
        }`}
        aria-modal="true"
        role="dialog"
      >
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setEditModal(false)}
          aria-hidden="true"
        />
        <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg ">
          <h3 className="text-lg font-semibold ">Edit Employee</h3>
          <form onSubmit={(e) => handleEditEmployee(e)} className="space-y-5">
            <div>
              <div className="w-24 h-24 text-md rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-white font-bold">
                {selectedEmployee?.avatar ? (
                  <img
                    src={`data:image/jpeg;base64,${selectedEmployee?.avatar}`}
                    alt="Avatar"
                    className="rounded-full"
                  />
                ) : (
                  "no avatar"
                )}
              </div>
              <label
                htmlFor="username"
                className="block mb-1 font-medium text-gray-700"
              >
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                id="avatar"
                name="avatar"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#260058]"
                placeholder="Enter Avatar"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block mb-1 font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                value={selectedEmployee?.username}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#260058]"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={selectedEmployee?.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#260058]"
                placeholder=""
              />
            </div>

            <div>
              <label htmlFor="department" className="block mb-1 font-medium">
                Department
              </label>
              <p className="text-sm text-gray-600">
                Current Department:{" "}
                <span className="font-medium">
                  {departments.find((d) => d.dept_name === selectedEmployee?.dept_name)
                    ?.dept_name || "Not Assigned"
                    }
                </span>
              </p>

              <select
                id="department"
                name="dept_id"
                value={selectedEmployee?.dept_id || ""}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.dept_id} value={dept.dept_id}>
                    {dept.dept_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditModal(false)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gray-400 border border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700 px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500 px-4 py-2"
              >
                Edit Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HREmployeeList;
