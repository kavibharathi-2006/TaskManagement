
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const API = "https://taskmanagement-yr1w.onrender.com/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API);
      setTasks(response.data);
    } catch (error) {
      console.log("Unable to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    try {
      await axios.post(API, { title });
      setTitle("");
      fetchTasks();
    } catch (error) {
      alert("Task could not be added");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API}/${id}`, { status });
      fetchTasks();
    } catch (error) {
      alert("Status could not be updated");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchTasks();
    } catch (error) {
      alert("Task could not be deleted");
    }
  };

  const statuses = ["Pending", "Ongoing", "Completed"];

  return (
    <div className="container py-5">
      <h1 className="text-center mb-2">Task Management</h1>
      <p className="text-center text-muted mb-4">
        Organize your daily tasks
      </p>

      <form className="d-flex gap-2 mb-5" onSubmit={addTask}>
        <input
          className="form-control"
          type="text"
          placeholder="Enter a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Add Task
        </button>
      </form>

      <div className="row">
        {statuses.map((status) => (
          <div className="col-md-4 mb-4" key={status}>
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-dark text-white">
                <h5 className="mb-0">{status}</h5>
              </div>

              <div className="card-body">
                {tasks.filter((task) => task.status === status).length === 0 ? (
                  <p className="text-muted">No tasks yet</p>
                ) : (
                  tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <div className="task-item mb-3 p-3" key={task._id}>
                        <h6>{task.title}</h6>

                        <select
                          className="form-select mb-2"
                          value={task.status}
                          onChange={(e) =>
                            updateStatus(task._id, e.target.value)
                          }
                        >
                          {statuses.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteTask(task._id)}
                        >
                          Delete
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
