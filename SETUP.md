# DocMorph AI - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (for backend)
- Git

## Frontend Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/docmorph-ai-frontend
cd docmorph-ai-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Run Development Server

```bash
npm run dev
```

Frontend runs at: http://localhost:3000

### 5. Build for Production

```bash
npm run build
npm run start
```

## Backend Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/docmorph-ai-engine
cd docmorph-ai-engine
```

### 2. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

Create `.env`:

```env
GEMINI_API_KEY=your_api_key
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=26214400  # 25MB
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### 5. Run Backend Server

```bash
python main.py
```

Backend runs at: http://localhost:8000

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health check |
| `/upload` | POST | Upload PDF |
| `/status/{jobId}` | GET | Get processing status |
| `/download/{jobId}` | POST | Download Excel |
| `/cancel/{jobId}` | POST | Cancel job |
| `/history` | GET | Get processing history |
| `/stats/dashboard` | GET | Get statistics |

## Testing the Integration

### 1. Health Check

```bash
curl http://localhost:8000/health
```

Expected: `{ "status": "ok" }`

### 2. Upload PDF

```bash
curl -X POST -F "file=@sample.pdf" http://localhost:8000/upload
```

Expected: 
```json
{
  "job_id": "abc123",
  "status": "pending",
  "message": "Upload successful"
}
```

### 3. Check Status

```bash
curl http://localhost:8000/status/abc123
```

### 4. Download File

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"format":"xlsx"}' \
  http://localhost:8000/download/abc123
```

## Development Workflow

### Frontend Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development

```bash
python main.py                    # Run server
python -m pytest                  # Run tests
python -m black .                 # Format code
python -m flake8 .                # Lint code
```

## Common Issues

### Port Already in Use

**Frontend (3000):**
```bash
lsof -i :3000
kill -9 <PID>
```

**Backend (8000):**
```bash
lsof -i :8000
kill -9 <PID>
```

### Backend Connection Error

Check that:
1. Backend is running (`python main.py`)
2. NEXT_PUBLIC_API_URL is correct in `.env.local`
3. Both are on same network/localhost
4. No firewall blocking connections

### Gemini API Error

1. Check API key in backend `.env`
2. Verify API is enabled in Google Cloud Console
3. Check API quota/billing

### File Upload Too Large

1. Check MAX_FILE_SIZE in backend `.env`
2. Ensure PDF < 25MB
3. Try compressing PDF

## Database Setup (Phase 3)

When adding authentication:

```bash
# Backend
python manage.py migrate
python manage.py createsuperuser
```

## Monitoring

### Frontend Logs

```bash
npm run dev  # Shows logs in terminal
```

Check browser console: F12 → Console tab

### Backend Logs

```bash
python main.py  # Shows logs in terminal
```

## Deployment

### Frontend (Vercel)

```bash
npm run build
vercel
```

Set environment variables in Vercel dashboard.

### Backend (Heroku)

```bash
git push heroku main
```

Set config vars:
```bash
heroku config:set GEMINI_API_KEY=xxx
heroku config:set ALLOWED_ORIGINS=https://yourdomain.com
```

## Documentation

- [Phase 2 Integration Guide](./PHASE2_INTEGRATION.md)
- [API Reference](./API.md)
- [Component Guide](./COMPONENTS.md)

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/feature-name`
5. Create Pull Request

## Support

- Issues: GitHub Issues
- Email: support@docmorph.ai
- Discord: [join link]

## License

MIT License - see LICENSE file for details
