const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-secret-key-change-in-production';
const JWT_EXPIRES_IN = '24h';

// Enable CORS
server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Helper function to generate JWT
function generateToken(user) {
  return jwt.sign(
    { user_id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// Helper function to verify JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Auth middleware
function authMiddleware(req, res, next) {
  // Skip auth for login/register
  if (req.path.startsWith('/auth/')) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  req.user = decoded;
  next();
}

// POST /auth/register
server.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'validation failed',
      fields: {
        ...((!name && { name: 'is required' })),
        ...((!email && { email: 'is required' })),
        ...((!password && { password: 'is required' }))
      }
    });
  }

  // Check if email already exists
  const db = router.db;
  const existingUser = db.get('users').find({ email }).value();

  if (existingUser) {
    return res.status(400).json({
      error: 'validation failed',
      fields: { email: 'already exists' }
    });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create new user
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: hashedPassword,
    created_at: new Date().toISOString()
  };

  db.get('users').push(newUser).write();

  // Generate token
  const token = generateToken(newUser);

  // Return user (without password) and token
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    token,
    user: userWithoutPassword
  });
});

// POST /auth/login
server.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: 'validation failed',
      fields: {
        ...((!email && { email: 'is required' })),
        ...((!password && { password: 'is required' }))
      }
    });
  }

  // Find user by email
  const db = router.db;
  const user = db.get('users').find({ email }).value();

  if (!user) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Verify password
  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  // Generate token
  const token = generateToken(user);

  // Return user (without password) and token
  const { password: _, ...userWithoutPassword } = user;
  res.status(200).json({
    token,
    user: userWithoutPassword
  });
});

// Apply auth middleware to all other routes
server.use(authMiddleware);

// Middleware to add timestamps to new projects
server.use((req, res, next) => {
  if (req.method === 'POST' && req.path === '/projects') {
    req.body.created_at = new Date().toISOString();
  }
  next();
});

// Custom route to get project with tasks (GET /projects/:id)
server.get('/projects/:id', (req, res) => {
  const db = router.db;
  const projectId = req.params.id;

  const project = db.get('projects').find({ id: projectId }).value();

  if (!project) {
    return res.status(404).json({ error: 'not found' });
  }

  const tasks = db.get('tasks').filter({ project_id: projectId }).value();

  res.json({
    ...project,
    tasks
  });
});

// Custom route to filter tasks (GET /projects/:id/tasks)
server.get('/projects/:projectId/tasks', (req, res) => {
  const db = router.db;
  const { projectId } = req.params;
  const { status, assignee } = req.query;

  let tasks = db.get('tasks').filter({ project_id: projectId });

  if (status) {
    tasks = tasks.filter({ status });
  }

  if (assignee) {
    tasks = tasks.filter({ assignee_id: assignee });
  }

  res.json({ tasks: tasks.value() });
});

// Custom route to create task (POST /projects/:id/tasks)
server.post('/projects/:projectId/tasks', (req, res) => {
  const db = router.db;
  const { projectId } = req.params;
  const { title, description, priority, assignee_id, due_date } = req.body;

  if (!title) {
    return res.status(400).json({
      error: 'validation failed',
      fields: { title: 'is required' }
    });
  }

  const newTask = {
    id: uuidv4(),
    title,
    description: description || '',
    status: 'todo',
    priority: priority || 'medium',
    project_id: projectId,
    assignee_id: assignee_id || null,
    due_date: due_date || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  db.get('tasks').push(newTask).write();

  res.status(201).json(newTask);
});

// Use default json-server router for other routes
server.use(router);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Mock API Server is running on http://localhost:${PORT}`);
  console.log('📋 Test credentials: test@example.com / password123');
});
