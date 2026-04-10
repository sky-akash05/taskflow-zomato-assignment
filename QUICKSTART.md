# TaskFlow - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### Prerequisites
- Docker installed and running
- Terminal access

### One-Command Setup

```bash
docker compose up
```

That's it! The first build takes 2-3 minutes to download and install dependencies.

### Access the Application

Once you see these messages:
```
mock-api-1   | 🚀 Mock API Server is running on http://localhost:4000
frontend-1   | (nginx started)
```

Open your browser:
- **Frontend**: http://localhost:3000
- **Mock API**: http://localhost:4000

### Test Login

Use these credentials to log in:
```
Email:    test@example.com
Password: password123
```

## 📋 What You'll See

1. **Login Page** - Enter test credentials
2. **Projects Page** - See 1 pre-loaded project
3. **Click the project** - View 3 sample tasks
4. **Try it out**:
   - Create a new project
   - Add tasks to projects
   - Filter tasks by status
   - Change task status (notice the instant update!)
   - Edit and delete tasks

## 🛠️ Common Issues

### "Port already in use"

If ports 3000 or 4000 are busy:

```bash
# Edit .env file and change ports
FRONTEND_PORT=3001
API_PORT=4001

# Then rebuild
docker compose down
docker compose up
```

### "Build failed"

Make sure Docker has enough resources:
- Docker Desktop → Settings → Resources
- Minimum: 2 CPU, 4GB RAM

### Stopping the Application

```bash
# Press Ctrl+C in the terminal, then:
docker compose down
```

### Clean Restart

```bash
# Remove all containers and volumes
docker compose down -v

# Rebuild and start fresh
docker compose up --build
```

## 🎯 Next Steps

1. **Explore the UI** - Try creating projects and tasks
2. **Test Filters** - Filter tasks by status and assignee
3. **Check Responsive Design** - Resize your browser window
4. **Review the Code** - Check out the clean component structure

## 📱 Mobile Testing

To test on mobile (same network):

1. Find your computer's local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Open `http://YOUR_IP:3000` on your phone

## 🐛 Debugging

View logs:
```bash
# All services
docker compose logs

# Just frontend
docker compose logs frontend

# Just mock API
docker compose logs mock-api

# Follow logs in real-time
docker compose logs -f
```

## ✅ Feature Checklist

Try these features:

- [ ] Login with test credentials
- [ ] View existing project
- [ ] Create a new project
- [ ] Edit project details
- [ ] Create a task
- [ ] Assign task to user
- [ ] Filter tasks by status
- [ ] Change task status (see optimistic UI!)
- [ ] Edit task details
- [ ] Delete a task
- [ ] Register a new user
- [ ] Logout and login again
- [ ] Refresh page (auth persists!)

## 💡 Tips

- **Instant Updates**: When you change a task status, notice how it updates immediately before the API responds - that's optimistic UI!
- **Empty States**: Delete all tasks to see the helpful empty state
- **Error Handling**: Try changing a task status with the API stopped to see error handling
- **Responsive**: Resize your browser to see mobile layout

## 📞 Need Help?

Check these resources:
- [README.md](README.md) - Full documentation
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Technical overview
- Assignment specification in original README

---

**Enjoy exploring TaskFlow!** 🎉
