const express = require('express');
const app = express();
const PORT = 3000;

// ============================================================
// Middleware
// ============================================================

// Parse JSON request bodies
app.use(express.json());

// Request logger – prints method, url, and timestamp for every request
app.use((req, _res, next) => {
  const now = new Date().toISOString();
  console.log(`[${req.method}] ${req.url} @ ${now}`);
  next();
});

// ============================================================
// In-memory data store
// ============================================================

let tasks = [
  { id: 1, title: 'Học Node.js cơ bản', completed: true, createdAt: '2025-02-01T08:00:00.000Z' },
  { id: 2, title: 'Cài đặt Express framework', completed: true, createdAt: '2025-02-02T09:15:00.000Z' },
  { id: 3, title: 'Tìm hiểu về REST API', completed: true, createdAt: '2025-02-03T10:30:00.000Z' },
  { id: 4, title: 'Viết endpoint GET danh sách', completed: true, createdAt: '2025-02-04T11:00:00.000Z' },
  { id: 5, title: 'Viết endpoint POST tạo mới', completed: true, createdAt: '2025-02-05T13:45:00.000Z' },
  { id: 6, title: 'Xử lý lỗi 404 Not Found', completed: true, createdAt: '2025-02-06T14:20:00.000Z' },
  { id: 7, title: 'Thêm middleware logging', completed: true, createdAt: '2025-02-07T08:30:00.000Z' },
  { id: 8, title: 'Viết endpoint PUT cập nhật', completed: true, createdAt: '2025-02-08T09:00:00.000Z' },
  { id: 9, title: 'Viết endpoint DELETE xóa task', completed: true, createdAt: '2025-02-09T10:15:00.000Z' },
  { id: 10, title: 'Viết endpoint PATCH cập nhật một phần', completed: true, createdAt: '2025-02-10T11:30:00.000Z' },
  { id: 11, title: 'Thêm validation cho title', completed: true, createdAt: '2025-02-11T14:00:00.000Z' },
  { id: 12, title: 'Hỗ trợ query string filter', completed: true, createdAt: '2025-02-12T15:30:00.000Z' },
  { id: 13, title: 'Sắp xếp task theo ngày tạo', completed: false, createdAt: '2025-02-13T08:45:00.000Z' },
  { id: 14, title: 'Viết file README.md', completed: false, createdAt: '2025-02-14T09:30:00.000Z' },
  { id: 15, title: 'Test API bằng Postman', completed: false, createdAt: '2025-02-15T10:00:00.000Z' },
  { id: 16, title: 'Học về middleware trong Express', completed: false, createdAt: '2025-02-16T11:15:00.000Z' },
  { id: 17, title: 'Tìm hiểu HTTP status codes', completed: false, createdAt: '2025-02-17T13:00:00.000Z' },
  { id: 18, title: 'Refactor code cho gọn gàng', completed: false, createdAt: '2025-02-18T14:30:00.000Z' },
  { id: 19, title: 'Deploy lên server thử nghiệm', completed: false, createdAt: '2025-02-19T16:00:00.000Z' },
  { id: 20, title: 'Nộp bài Assignment 00', completed: false, createdAt: '2025-02-20T08:00:00.000Z' },
];
let nextId = 21;

// ============================================================
// Helper: validate title
// ============================================================

function validateTitle(title) {
  if (title === undefined || title === null || typeof title !== 'string') {
    return 'Title is required and must be a string';
  }
  const trimmed = title.trim();
  if (trimmed.length === 0) {
    return 'Title must not be empty';
  }
  if (trimmed.length < 3 || trimmed.length > 100) {
    return 'Title must be between 3 and 100 characters';
  }
  return null; // valid
}

// ============================================================
// Routes
// ============================================================

// GET / – Welcome / API info
app.get('/', (_req, res) => {
  res.json({
    message: 'Task Management REST API',
    endpoints: {
      'GET    /api/tasks': 'Lấy tất cả công việc (?completed=true|false)',
      'GET    /api/tasks/:id': 'Lấy chi tiết một công việc',
      'POST   /api/tasks': 'Tạo công việc mới { "title": "..." }',
      'PUT    /api/tasks/:id': 'Cập nhật toàn bộ { "title": "...", "completed": bool }',
      'PATCH  /api/tasks/:id': 'Cập nhật một phần',
      'DELETE /api/tasks/:id': 'Xóa công việc',
    },
  });
});

// GET /api/tasks
// Supports query: ?completed=true|false
// Results sorted by createdAt descending (newest first)
app.get('/api/tasks', (req, res) => {
  let result = [...tasks];

  // Filter by completed status if query param is provided
  const { completed } = req.query;
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    result = result.filter((t) => t.completed === isCompleted);
  }

  // Sort by createdAt descending (newest first)
  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(result);
});

// GET /api/tasks/:id
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// POST /api/tasks
app.post('/api/tasks', (req, res) => {
  const { title } = req.body;

  const error = validateTitle(title);
  if (error) {
    return res.status(400).json({ error });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id  –  full update
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, completed } = req.body;

  // Validate title
  const titleError = validateTitle(title);
  if (titleError) {
    return res.status(400).json({ error: titleError });
  }

  // Validate completed
  if (completed === undefined || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'completed is required and must be a boolean' });
  }

  task.title = title.trim();
  task.completed = completed;

  res.json(task);
});

// PATCH /api/tasks/:id  –  partial update
app.patch('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, completed } = req.body;

  // Validate title if provided
  if (title !== undefined) {
    const titleError = validateTitle(title);
    if (titleError) {
      return res.status(400).json({ error: titleError });
    }
    task.title = title.trim();
  }

  // Validate completed if provided
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'completed must be a boolean' });
    }
    task.completed = completed;
  }

  res.json(task);
});

// DELETE /api/tasks/:id
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  res.status(204).send();
});

// ============================================================
// Start server
// ============================================================

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
