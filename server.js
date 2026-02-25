const express = require('express');
const logger = require('./middleware/logger');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 3000;

// ============================================================
// Middleware
// ============================================================

// Parse JSON request bodies
app.use(express.json());

// Request logger – prints method, url, and timestamp for every request
app.use(logger);

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

// Task routes
app.use('/api/tasks', taskRoutes);

// ============================================================
// Start server
// ============================================================

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
