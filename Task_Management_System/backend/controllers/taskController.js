const db = require('../models');

const getTasks = (req, res) => {
  const { role, id: userId } = req.user;
  
  if (role === 'admin') {
    db.all(`SELECT t.*, u.username as createdByUsername FROM tasks t JOIN users u ON t.createdBy = u.id`, (err, tasks) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(tasks);
    });
  } else {
    db.all(`SELECT * FROM tasks WHERE createdBy = ?`, [userId], (err, tasks) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      res.json(tasks);
    });
  }
};

const createTask = (req, res) => {
  const { title, description, status } = req.body;
  const createdBy = req.user.id;

  if (!title) return res.status(400).json({ message: 'Task title is required' });

  db.run(
    `INSERT INTO tasks (title, description, status, createdBy) VALUES (?, ?, ?, ?)`,
    [title, description || '', status || 'pending', createdBy],
    function(err) {
      if (err) return res.status(500).json({ message: 'Error creating task' });
      db.get(`SELECT * FROM tasks WHERE id = ?`, [this.lastID], (err, task) => {
          res.status(201).json(task);
      });
    }
  );
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const { id: userId, role } = req.user;

  if (!title) return res.status(400).json({ message: 'Task title is required' });
  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, task) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.createdBy !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    db.run(
      `UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?`,
      [title, description || '', status || 'pending', id],
      function(err) {
        if (err) return res.status(500).json({ message: 'Error updating task' });
        db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, updatedTask) => {
            res.json(updatedTask);
        });
      }
    );
  });
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  const { id: userId, role } = req.user;

  db.get(`SELECT * FROM tasks WHERE id = ?`, [id], (err, task) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    if (role !== 'admin' && task.createdBy !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    db.run(`DELETE FROM tasks WHERE id = ?`, [id], function(err) {
      if (err) return res.status(500).json({ message: 'Error deleting task' });
      res.json({ message: 'Task removed' });
    });
  });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };