import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel({ user }) {
  const [employees, setEmployees] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    password: "",
    role: "employee",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });
  const [taskList, setTaskList] = useState([]);

  // Leave request state
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [newLeave, setNewLeave] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Load data function: users, tasks, leave requests
  const load = async () => {
    try {
      // Load users
      const resUsers = await axios.get("http://localhost:5000/api/users");
      setEmployees(resUsers.data);

      // Load tasks (filtered by user role)
      const resTasks = await axios.post("http://localhost:5000/api/tasks/list", {
        username: user.username,
        role: user.role,
      });
      setTaskList(resTasks.data);

      // Load leave requests (admin sees all, employee sees own)
      const resLeaves = await axios.post("http://localhost:5000/api/leave/list", {
        username: user.username,
        role: user.role,
      });
      setLeaveRequests(resLeaves.data);
    } catch (error) {
      console.error("Error loading data:", error);
      alert("Failed to load data.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Create user
  const createUser = async () => {
    if (!newUser.name || !newUser.username || !newUser.password) {
      alert("Please fill all user fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/users", newUser);
      setNewUser({ name: "", username: "", password: "", role: "employee" });
      load();
    } catch (error) {
      alert(
        error.response?.data?.message || "Failed to create user. Username may already exist."
      );
      console.error(error);
    }
  };

  // Assign task
  const assignTask = async () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo) {
      alert("Please fill all task fields.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/tasks", newTask);
      setNewTask({ title: "", description: "", assignedTo: "" });
      load();
    } catch (error) {
      alert("Failed to assign task.");
      console.error(error);
    }
  };

  // Submit leave request (only employees)
  const submitLeaveRequest = async () => {
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
      alert("Please fill all leave request fields.");
      return;
    }

    if (newLeave.startDate > newLeave.endDate) {
      alert("End date must be after start date.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/leave", {
        ...newLeave,
        username: user.username,
        status: "pending",
      });
      setNewLeave({ startDate: "", endDate: "", reason: "" });
      load();
    } catch (error) {
      alert("Failed to submit leave request.");
      console.error(error);
    }
  };

  // Approve or reject leave request (only admin)
  const handleLeaveStatusChange = async (leaveId, status) => {
    try {
      await axios.post("http://localhost:5000/api/leave/approve", {
        leaveId,
        status,
      });
      load();
    } catch (error) {
      alert("Failed to update leave request status.");
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>

      {/* Create User */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Create User</h3>
        <input
          className="border p-1 m-1 w-full"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <input
          className="border p-1 m-1 w-full"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          className="border p-1 m-1 w-full"
          placeholder="Password"
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
        <select
          className="border p-1 m-1 w-full"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        >
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 m-1 rounded"
          onClick={createUser}
        >
          Create
        </button>
      </section>

      {/* Assign Task */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Assign Task</h3>
        <input
          className="border p-1 m-1 w-full"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <input
          className="border p-1 m-1 w-full"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <select
          className="border p-1 m-1 w-full"
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
        >
          <option value="">Select Employee</option>
          {employees.map((emp) => (
            <option key={emp._id} value={emp.username}>
              {emp.name}
            </option>
          ))}
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 m-1 rounded"
          onClick={assignTask}
        >
          Assign
        </button>
      </section>

      {/* Task List */}
      <section className="mb-6">
        <h3 className="font-semibold mb-2">Task List</h3>
        {taskList.length === 0 && <p>No tasks assigned yet.</p>}
        {taskList.map((task) => (
          <div key={task._id} className="border p-2 my-2 rounded">
            <b>{task.title}</b> → {task.assignedTo} — <i>{task.status}</i>
          </div>
        ))}
      </section>

      {/* Leave Requests Section */}
      <section>
        <h3 className="font-semibold mb-2">Leave Requests</h3>

        {/* Submit leave request form only for employees */}
        {user.role === "employee" && (
          <div className="mb-4 border p-3 rounded">
            <h4 className="font-semibold mb-2">Submit Leave Request</h4>
            <label>
              Start Date:
              <input
                type="date"
                className="border p-1 m-1 w-full"
                value={newLeave.startDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, startDate: e.target.value })
                }
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                className="border p-1 m-1 w-full"
                value={newLeave.endDate}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, endDate: e.target.value })
                }
              />
            </label>
            <label>
              Reason:
              <textarea
                className="border p-1 m-1 w-full"
                placeholder="Reason for leave"
                value={newLeave.reason}
                onChange={(e) =>
                  setNewLeave({ ...newLeave, reason: e.target.value })
                }
              />
            </label>
            <button
              className="bg-yellow-500 text-white px-4 py-2 m-1 rounded"
              onClick={submitLeaveRequest}
            >
              Submit Leave Request
            </button>
          </div>
        )}

        {/* Display leave requests */}
        {leaveRequests.length === 0 && <p>No leave requests.</p>}
        {leaveRequests.map((leave) => (
          <div
            key={leave._id}
            className="border p-2 my-2 rounded flex flex-col gap-1"
          >
            <div>
              <b>Employee:</b> {leave.username}
            </div>
            <div>
              <b>From:</b> {leave.startDate} <b>To:</b> {leave.endDate}
            </div>
            <div>
              <b>Reason:</b> {leave.reason}
            </div>
            <div>
              <b>Status:</b>{" "}
              <span
                className={`${
                  leave.status === "approved"
                    ? "text-green-600"
                    : leave.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
                } font-semibold`}
              >
                {leave.status.toUpperCase()}
              </span>
            </div>

            {/* Admin can approve/reject pending requests */}
            {user.role === "admin" && leave.status === "pending" && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleLeaveStatusChange(leave._id, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleLeaveStatusChange(leave._id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default AdminPanel;
