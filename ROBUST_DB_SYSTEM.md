# Robust Database Management System

## ✅ What's Configured

### Unique Port
- **Port**: 54321 (instead of 5432)
- **Why**: Avoids conflicts with other Postgres instances
- **Connection**: `postgresql://postgres:postgres@127.0.0.1:54321/postgres`

### Robust Scripts
- ✅ **start-db.ps1** - Smart start (checks if running)
- ✅ **stop-db.ps1** - Graceful stop
- ✅ **restart-db.ps1** - Force restart (kills and starts fresh)
- ✅ **kill-db.ps1** - Force kill (frees port, removes container)
- ✅ **check-db.ps1** - Health check and diagnostics

## 🚀 Usage

### Start Database
```powershell
.\scripts\start-db.ps1
```
- Checks if already running
- Starts existing container if stopped
- Creates new container if needed

### Stop Database
```powershell
.\scripts\stop-db.ps1
```
- Gracefully stops container
- Keeps data (container not removed)

### Restart Database (Recommended)
```powershell
.\scripts\restart-db.ps1
```
- Kills existing container
- Frees port 54321
- Starts fresh container
- Waits for health check
- Shows status

### Force Kill (Emergency)
```powershell
.\scripts\kill-db.ps1
```
- Force stops container
- Removes container
- Kills any process on port 54321
- Use when database is stuck

### Check Status
```powershell
.\scripts\check-db.ps1
```
- Shows container status
- Tests connection
- Checks port
- Displays connection string

## 🔧 Update Your .env

**Important:** Update your connection string to use port 54321:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54321/postgres"
```

## 🎯 Robust Features

### 1. Port Conflict Handling
- Automatically kills processes on port 54321
- Checks port availability before starting

### 2. Container Cleanup
- Removes orphaned containers
- Handles stopped containers
- Cleans up on restart

### 3. Health Checks
- Waits for database to be ready
- Tests connection before reporting success
- Shows detailed status

### 4. Idempotent Operations
- Start script checks if already running
- Restart script always works (kills first)
- Safe to run multiple times

## 📊 Workflow Examples

### Daily Development
```powershell
# Start (if not running)
.\scripts\start-db.ps1

# Check status
.\scripts\check-db.ps1
```

### When Database is Stuck
```powershell
# Force restart
.\scripts\restart-db.ps1
```

### Emergency Reset
```powershell
# Kill everything
.\scripts\kill-db.ps1

# Start fresh
.\scripts\start-db.ps1
```

### After System Restart
```powershell
# Database might be stopped
.\scripts\start-db.ps1
# Will detect and start existing container
```

## 🔍 Troubleshooting

### Port Still in Use
```powershell
# Use kill script
.\scripts\kill-db.ps1

# Then restart
.\scripts\restart-db.ps1
```

### Container Won't Start
```powershell
# Force kill
.\scripts\kill-db.ps1

# Check Docker
docker ps -a

# Start fresh
.\scripts\start-db.ps1
```

### Database Not Responding
```powershell
# Check status
.\scripts\check-db.ps1

# Restart if needed
.\scripts\restart-db.ps1
```

## 📝 Connection Details

**New Connection String:**
```
postgresql://postgres:postgres@127.0.0.1:54321/postgres
```

**Port:** 54321 (unique, no conflicts)

**Container:** `calc-creator-db`

**Volume:** `calculatorcreatorapp_postgres-data` (persistent)

---

**System is robust!** Use `restart-db.ps1` for reliable restarts. 🚀




