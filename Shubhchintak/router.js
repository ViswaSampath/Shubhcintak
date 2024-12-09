
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Task } = require('./models'); 
const authenticateToken = require('./middleware/authenticateToken');
const router = express.Router();


router.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({ username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully' });
});


router.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
  res.json({ token });
});


router.get('/api/tasks', authenticateToken, async (req, res) => {
  const tasks = await Task.findAll({ where: { userId: req.user.userId } });
  res.json(tasks);
});


router.post('/api/tasks', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.create({
    userId: req.user.userId,
    title,
    description,
    status: status || 'To Do',
  });
  res.status(201).json(task);
});

router.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.userId } });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  task.title = title || task.title;
  task.description = description || task.description;
  task.status = status || task.status;
  await task.save();

  res.json(task);
});


router.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.userId } });

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  await task.destroy();
  res.status(204).json();
});

module.exports = router;
