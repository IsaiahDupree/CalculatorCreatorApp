# Quick Database Commands

## 🚀 Start Database
```powershell
.\scripts\start-db.ps1
```
- Smart: Checks if already running
- Safe: Won't create duplicates

## 🛑 Stop Database
```powershell
.\scripts\stop-db.ps1
```
- Graceful stop
- Keeps data

## 🔄 Restart Database (Recommended)
```powershell
.\scripts\restart-db.ps1
```
- Kills existing container
- Frees port
- Starts fresh
- Waits for health check

## 💀 Force Kill (Emergency)
```powershell
.\scripts\kill-db.ps1
```
- Force stops everything
- Frees port 54321
- Removes container

## 🔍 Check Status
```powershell
.\scripts\check-db.ps1
```
- Shows container status
- Tests connection
- Displays connection string

## 📝 Connection String

```
postgresql://postgres:postgres@127.0.0.1:54321/postgres
```

**Port:** 54321 (unique, no conflicts)

---

**Use `restart-db.ps1` for reliable restarts!** 🚀




