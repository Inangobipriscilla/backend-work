const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

// App for student section (port 3001)
const studentApp = express();
const studentPort = 4000;

// App for admin section (port 3002)
const adminApp = express();
const adminPort = 4001;

// App for general sections like chapters and login (port 3000)
const generalApp = express();
const generalPort =4002 ;

// Middleware to parse JSON requests and enable CORS
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });
  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    req.user = user;
    next();
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// In-memory data (replace with a database in production)
const users = [
  { id: 1, username: 'irene', password: '1101', role: 'admin' }, // Note: Unhashed password
  { id: 2, username: 'priscilla', password: '2222', role: 'student' }, // Note: Unhashed password
];

const chapters = [
  { id: 1, name: 'Robotics and AI Chapter', description: 'Focused on AI and robotics.', members: 120, events: 15 },
  { id: 2, name: 'Data Science', description: 'Data science and analytics.', members: 95, events: 12 },
  { id: 3, name: 'Mechatronics Engineering', description: 'Engineering and mechanics.', members: 75, events: 8 },
  { id: 4, name: 'Augmented Reality', description: 'AR research and apps.', members: 60, events: 10 },
  { id: 5, name: 'Cybersecurity Club', description: 'Cybersecurity education.', members: 85, events: 9 },
  { id: 6, name: 'Graphics and Animations', description: 'Graphics and open source.', members: 70, events: 7 },
];

const events = [
  { id: 1, title: 'Algorithm Competition', date: '2023-06-15', time: '2:00 PM', location: 'CS Building' },
  { id: 2, title: 'Web Dev Workshop', date: '2023-06-20', time: '3:30 PM', location: 'Engineering Hall' },
  { id: 3, title: 'Cybersecurity Seminar', date: '2023-06-25', time: '1:00 PM', location: 'Online' },
];

const notifications = [
  { id: 1, message: 'New event added to ACM Student Chapter', time: '2 hours ago' },
  { id: 2, message: 'Your event registration was confirmed', time: '1 day ago' },
  { id: 3, message: 'New resource available in Cybersecurity Club', time: '2 days ago' },
];

// General Routes
generalApp.use(express.json());
generalApp.use(cors({ origin: 'http://localhost:3000' })); // Add CORS for general app

generalApp.get('/api/chapters', (req, res) => {
  res.json(chapters);
});

generalApp.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({ message: 'Login successful', role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

generalApp.listen(generalPort, '0.0.0.0', () => { // Add '0.0.0.0' for network access
  console.log(`General server running at http://0.0.0.0:${generalPort}`)
});

// Student Routes
studentApp.use(express.json());
studentApp.use(cors({ origin: 'http://localhost:3000' })); // Add CORS for student app

studentApp.get('/api/student/dashboard', authenticate, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  res.json({
    upcomingEvents: events,
    myChapters: chapters.slice(0, 2),
    notifications,
  });
});

studentApp.listen(studentPort, '0.0.0.0', () => { // Add '0.0.0.0' for network access
  console.log(`Student server running at http://0.0.0.0:${studentPort}`);
});

// Admin Routes
adminApp.use(express.json());
adminApp.use(cors({ origin: 'http://localhost:3000' })); // Add CORS for admin app

adminApp.get('/api/admin/dashboard', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' }); // Fixed 'irene' to 'admin'
  res.json({
    stats: {
      totalMembers: users.length,
      totalChapters: chapters.length,
      upcomingEvents: events.length,
    },
    events,
    users,
  });
});

adminApp.listen(adminPort, '0.0.0.0', () => { // Add '0.0.0.0' for network access
  console.log(`Admin server running at http://0.0.0.0:${adminPort}`);
});
