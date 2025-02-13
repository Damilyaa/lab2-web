const Task = require('../models/Task');

exports.createTask = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    const newTask = new Task({ title, description, user: userId });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, completed } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this task' });
    }

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    if (completed !== undefined) task.completed = completed;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};
