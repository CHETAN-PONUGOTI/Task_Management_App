import React, { useState, useEffect } from 'react';
import API from '../services/api';
import TaskCard from '../components/TaskCard';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch tasks');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await API.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting task');
      }
    }
  };
  
  const openCreateModal = () => {
      setCurrentTask(null);
      setIsModalOpen(true);
  };
  
  const openEditModal = (task) => {
      setCurrentTask(task);
      setIsModalOpen(true);
  };

  if (loading) return <div className="text-center mt-10">Loading tasks...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {isAdmin ? 'Admin Dashboard - All Tasks' : 'My Tasks'}
      </h2>
      <button
        onClick={openCreateModal}
        className="mb-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Create New Task
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isAdmin={isAdmin}
              onDelete={handleDelete}
              onEdit={openEditModal}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No tasks found.</p>
        )}
      </div>
      
      {isModalOpen && (
          <TaskFormModal
            task={currentTask}
            onClose={() => setIsModalOpen(false)}
            onTaskUpdated={fetchTasks}
          />
      )}
    </div>
  );
};

// Task Form Modal Component (Simplified for brevity)
const TaskFormModal = ({ task, onClose, onTaskUpdated }) => {
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'pending',
    });
    const [submitting, setSubmitting] = useState(false);
    const isEdit = !!task;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (isEdit) {
                await API.put(`/tasks/${task.id}`, formData);
            } else {
                await API.post('/tasks', formData);
            }
            onTaskUpdated();
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save task');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit Task' : 'Create Task'}</h3>
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={onChange}
                            required
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded"
                        ></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={onChange}
                            className="w-full px-3 py-2 border rounded"
                        >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {submitting ? 'Saving...' : (isEdit ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default Dashboard;