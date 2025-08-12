# MongoDB Setup for Hospital System

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Go to** [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Create free account**
3. **Create cluster** (free tier)
4. **Get connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hospital_system
   ```
5. **Set environment variable**:
   ```bash
   set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_system
   ```

## Option 2: Local MongoDB

1. **Download** MongoDB Community Server
2. **Install** and start MongoDB service
3. **Default connection**: `mongodb://localhost:27017/`

## Database Structure

### Collections:
- **patients** - Patient appointments and details
- **predictions** - AI prediction results
- **alerts** - System alerts and notifications
- **schedules** - Rescheduling history

### Sample Data:
The system automatically creates sample patients when started.

## Run with Database:

```bash
pip install -r requirements.txt
python hospital_system.py
```

## API Endpoints with Database:

- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add new patient
- `GET /api/predictions` - Get predictions from DB
- `GET /api/alerts` - Get active alerts
- `GET /api/schedule` - Get schedule summary

## Environment Variables:

```bash
MONGODB_URI=your_mongodb_connection_string
```