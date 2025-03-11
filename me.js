const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');

const App = express();

App.use(express.json());
App.use(cors());
App.use(express.urlencoded({ extended: true }));


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

const users = [
  { id: 1, username: 'irene', password: '$2b$10$...irene_hash...', role: 'admin' },
  { id: 2, username: 'priscilla', password: '$2b$10$...priscilla_hash', role: 'student' },
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


// Add a route for the root path
App.get('/', (req, res) => {
  res.send('Server is running correctly');
});

App.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});


// General Routes
App.get('/api/chapters', (req, res) => {
  res.json(chapters);
});

App.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    res.json({ message: 'Login successful', role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Student Routes
App.get('/api/student/dashboard', authenticate, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  res.json({
    upcomingEvents: events,
    myChapters: chapters.slice(0, 2),
    notifications,
  });
});

// Admin Routes
App.get('/api/admin/dashboard', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
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

//edit an event
App.put('/api/admin/events/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const eventID = parseInt(req.params.id);
  const { title, date, time, location } = req.body;

  const eventIndex = events.findIndex(e => e.id === eventID);
  if (eventIndex === -1) return res.status(404).json({ message: 'Event not found' });

  events[eventIndex] = { ...events[eventIndex], title, date, time, location };
  res.json(events[eventIndex]);
});


//delete an event

// Add this endpoint to server.js
App.delete('/api/admin/events/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const eventID = parseInt(req.params.id);
  
  const eventIndex = events.findIndex(e => e.id === eventID);
  if (eventIndex === -1) return res.status(404).json({ message: 'Event not found' });

  events.splice(eventIndex, 1);
  res.json({ message: 'Event deleted successfully' });
});



// Delete a user
App.delete('/api/admin/users/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const userId = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove the user
  users.splice(userIndex, 1);

  res.json({ message: 'User deleted successfully' });
});

App.get('/api/admin/dashboard', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
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


//edit a chapter

App.put('/api/admin/chapters/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const chapterId = parseInt(req.params.id);
  const { name, description } = req.body;

  const chapterIndex = chapters.findIndex(c => c.id === chapterId);
  if (chapterIndex === -1) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  // Update the chapter
  chapters[chapterIndex] = { ...chapters[chapterIndex], name, description };

  res.json({ message: 'Chapter updated successfully', chapter: chapters[chapterIndex] });
});

// Delete a chapter
App.delete('/api/admin/chapters/:id', authenticate, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

  const chapterId = parseInt(req.params.id);

  const chapterIndex = chapters.findIndex(c => c.id === chapterId);
  if (chapterIndex === -1) {
    return res.status(404).json({ message: 'Chapter not found' });
  }

  // Remove the chapter
  chapters.splice(chapterIndex, 1);

  res.json({ message: 'Chapter deleted successfully' });
});


//
const PORT =process.env.PORT || 3001;


App.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`API test running at http://localhost:${PORT}/api/test`);

});
