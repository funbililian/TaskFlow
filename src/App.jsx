
import { useState, useEffect } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import {
  getTasks,
  saveTasks,
  logoutUser,
} from "./services/api";

import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";

import "./App.css";

function formatDueDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [taskSyncError, setTaskSyncError] = useState("");

  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [newDueDate, setNewDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  // Load this logged-in user's tasks from MongoDB.
  useEffect(() => {
    let active = true;

    async function loadTasks() {
      if (!localStorage.getItem("taskflow_token")) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const data = await getTasks();

        if (!active) return;

        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        localStorage.setItem(
          "taskflow-tasks",
          JSON.stringify(data.tasks ?? [])
        );

        setTaskSyncError("");
        setTasksLoaded(true);
      } catch (error) {
        if (!active) return;

        const message =
          error?.message || "Unable to load your saved tasks.";

        setTaskSyncError(message);

        if (
          /authentication|required|token|session|log in|account not found/i.test(
            message
          )
        ) {
          logoutUser();
          navigate("/login", { replace: true });
        }
      }
    }

    loadTasks();

    return () => {
      active = false;
    };
  }, [navigate]);

  // Save task changes to the browser cache and MongoDB.
  useEffect(() => {
    if (!tasksLoaded) return;

    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));

    const timeoutId = setTimeout(async () => {
      try {
        await saveTasks(tasks);
        setTaskSyncError("");
      } catch (error) {
        setTaskSyncError(
          error?.message || "Unable to save your tasks to the server."
        );
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [tasks, tasksLoaded]);

  const completedTasks = tasks.filter((task) => task.completed).length;

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Active") return !task.completed;
    if (filter === "Completed") return task.completed;
    return true;
  });

  function toggleTask(id) {
    if (!tasksLoaded) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function addTask(event) {
    event.preventDefault();

    if (!tasksLoaded) return;

    const title = newTask.trim();

    if (!title) {
      alert("Please enter a task first!");
      return;
    }

    const task = {
      id: Date.now(),
      title,
      completed: false,
      priority: newPriority,
      dueDate: newDueDate,
    };

    setTasks((currentTasks) => [...currentTasks, task]);

    setNewTask("");
    setNewPriority("Medium");
    setNewDueDate("");
  }

  function deleteTask(id) {
    if (!tasksLoaded) return;

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  }

  return (
    <main
      className={`app ${
        sidebarOpen ? "sidebar-open" : "sidebar-closed"
      }`}
    >
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={sidebarOpen}
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <aside className="sidebar">
        <h2 className="brand">
          TaskFlow<span>.</span>
        </h2>

        <p className="menu-label">WORKSPACE</p>

        <nav>
          <a href="#dashboard" className="nav-link active">
            ◫ Dashboard
          </a>

          <a href="#tasks" className="nav-link">
            ✓ My Tasks
          </a>
        </nav>

        <div className="sidebar-bottom">
          <p>Small steps, big progress.</p>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <section className="main-content" id="dashboard">
        <header className="topbar">
          <span>My Workspace</span>

          
<div className="topbar-actions">
  <Link to="/" className="profile-button">
    Home
  </Link>

  <Link to="/profile" className="profile-button">
    Profile
  </Link>
</div>

        </header>

        <div className="welcome">
          <p className="eyebrow">YOUR PERSONAL WORKSPACE</p>
          <h1>Good things take time.</h1>
          <p>Organise your tasks and make today count.</p>
        </div>

        <section className="stats">
          <article className="stat-card">
            <p>Total tasks</p>
            <h2>{tasks.length}</h2>
          </article>

          <article className="stat-card">
            <p>Completed</p>
            <h2>{completedTasks}</h2>
          </article>

          <article className="stat-card">
            <p>Remaining</p>
            <h2>{tasks.length - completedTasks}</h2>
          </article>
        </section>

        <section className="task-section" id="tasks">
          {!tasksLoaded && !taskSyncError && (
            <p role="status">Loading your saved tasks...</p>
          )}

          {taskSyncError && (
            <p className="auth-message auth-error" role="alert">
              {taskSyncError}
            </p>
          )}

          {tasksLoaded && !taskSyncError && (
            <p role="status">Your tasks are synced.</p>
          )}

          <form className="add-task-form" onSubmit={addTask}>
            <input
              type="text"
              placeholder="What needs to get done?"
              value={newTask}
              onChange={(event) => setNewTask(event.target.value)}
              aria-label="New task title"
              maxLength={120}
              disabled={!tasksLoaded}
            />

            <select
              value={newPriority}
              onChange={(event) => setNewPriority(event.target.value)}
              aria-label="Task priority"
              disabled={!tasksLoaded}
            >
              <option value="Low">Low priority</option>
              <option value="Medium">Medium priority</option>
              <option value="High">High priority</option>
            </select>

            <input
              type="date"
              value={newDueDate}
              onChange={(event) => setNewDueDate(event.target.value)}
              aria-label="Task due date"
              disabled={!tasksLoaded}
            />

            <button type="submit" disabled={!tasksLoaded}>
              + Add task
            </button>
          </form>

          <div className="section-heading">
            <div>
              <h2>Today's tasks</h2>
              <p>Keep moving forward, one task at a time.</p>
            </div>

            <span className="task-count">
              {tasks.length} tasks
            </span>
          </div>

          <div className="task-filters">
            {["All", "Active", "Completed"].map((option) => (
              <button
                key={option}
                type="button"
                className={
                  filter === option ? "filter-btn active" : "filter-btn"
                }
                onClick={() => setFilter(option)}
              >
                {option} (
                {option === "All"
                  ? tasks.length
                  : option === "Active"
                    ? tasks.filter((task) => !task.completed).length
                    : tasks.filter((task) => task.completed).length}
                )
              </button>
            ))}
          </div>

          <div className="task-list">
            {tasksLoaded && filteredTasks.length === 0 && (
              <p>
                {filter === "All"
                  ? "No tasks yet. Add your first task above!"
                  : `No ${filter.toLowerCase()} tasks found.`}
              </p>
            )}

            {filteredTasks.map((task) => {
              const today = new Date();
              const todayString = [
                today.getFullYear(),
                String(today.getMonth() + 1).padStart(2, "0"),
                String(today.getDate()).padStart(2, "0"),
              ].join("-");

              const isOverdue =
                !task.completed &&
                task.dueDate &&
                task.dueDate < todayString;

              return (
                <label className="task-item" key={task.id}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    disabled={!tasksLoaded}
                  />

                  <span
                    className={
                      task.completed
                        ? "task-title completed"
                        : "task-title"
                    }
                  >
                    {task.title}
                  </span>

                  <span
                    className={
                      task.completed ? "status done" : "status pending"
                    }
                  >
                    {task.completed ? "Done" : "In progress"}
                  </span>

                  <span
                    className={`priority-badge priority-${
                      task.priority || "Medium"
                    }`}
                  >
                    {task.priority || "Medium"}
                  </span>

                  {task.dueDate && (
                    <span
                      className={
                        isOverdue
                          ? "task-due-date overdue"
                          : "task-due-date"
                      }
                    >
                      {isOverdue ? "Overdue · " : "Due: "}
                      {formatDueDate(task.dueDate)}
                    </span>
                  )}

                  <button
                    type="button"
                    className="delete-task-btn"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete ${task.title}`}
                    disabled={!tasksLoaded}
                  >
                    Delete
                  </button>
                </label>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
