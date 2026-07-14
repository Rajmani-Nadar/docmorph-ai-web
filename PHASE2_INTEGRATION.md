# Phase 2: Backend Integration Guide

## Overview

Phase 2 connects the DocMorph AI frontend to the Python backend for real PDF extraction workflows.

## Architecture

```
Frontend (Next.js)
    ↓
API Service Layer (src/lib/api.ts)
    ↓
Backend (Python)
    ├─ PDF Upload
    ├─ Convert to Images
    ├─ Gemini OCR
    ├─ Extract Tables
    └─ Generate Excel
```

## Setup

### 1. Environment Configuration

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Start Backend

The Python backend must be running before testing uploads:

```bash
git clone https://github.com/yourusername/docmorph-ai-engine
cd docmorph-ai-engine
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```

Backend should be available at `http://localhost:8000`

### 3. Test Health Check

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{ "status": "ok" }
```

## API Integration

### File Structure

```
src/
├─ lib/
│  └─ api.ts              # Backend API calls
├─ types/
│  └─ index.ts            # TypeScript types
├─ hooks/
│  └─ use-upload.ts       # Upload state management
├─ app/
│  ├─ context/
│  │  └─ auth-context.tsx # Authentication (Phase 3)
│  └─ upload/
│     └─ page.tsx         # Upload page
└─ components/
   ├─ processing-status.tsx
   ├─ excel-preview.tsx
   └─ error-alert.tsx
```

## API Endpoints

### Upload PDF

**Request:**
```
POST /upload
Content-Type: multipart/form-data

file: <PDF_FILE>
```

**Response:**
```json
{
  "job_id": "abc123",
  "status": "pending",
  "message": "Upload successful"
}
```

### Get Job Status

**Request:**
```
GET /status/{jobId}
```

**Response:**
```json
{
  "job_id": "abc123",
  "status": "processing",
  "current_step": "reading_page",
  "progress": 45,
  "total_pages": 5,
  "current_page": 2,
  "extracted_data": [...],
  "error": null
}
```

### Download Excel

**Request:**
```
POST /download/{jobId}
Content-Type: application/json

{ "format": "xlsx" }
```

**Response:**
```json
{
  "download_url": "https://...",
  "file_format": "xlsx"
}
```

### Cancel Job

**Request:**
```
POST /cancel/{jobId}
```

**Response:**
```json
{ "message": "Job cancelled" }
```

## How It Works

### Upload Flow

1. User selects PDF file
2. File validation (type, size)
3. Click "Upload & Process"
4. `handleUpload()` sends to backend
5. Backend returns `job_id`
6. Frontend starts polling `/status/{jobId}` every 2 seconds
7. UI updates with current processing step
8. When complete, display extracted data in table
9. User downloads Excel/CSV

### Processing Steps

```
upload_complete     ← File uploaded to backend
converting_pdf      ← PDF pages to images
reading_page        ← OCR on current page
ai_recognition      ← Gemini processes handwriting
structuring_data    ← Data organized into tables
generating_excel    ← Excel file created
ready               ← Ready for download
```

## Components

### ProcessingStatus
Displays animated processing steps with progress bar

```tsx
<ProcessingStatus 
  currentStep={currentStep}
  progress={progress}
  totalPages={10}
  currentPage={2}
/>
```

### ExcelPreview
Shows extracted data in a table with download options

```tsx
<ExcelPreview
  data={extractedData}
  filename="students.pdf"
  onDownload={(format) => handleDownload(format)}
  onReset={() => reset()}
/>
```

### ErrorAlert
Displays error messages with retry option

```tsx
<ErrorAlert
  error="Upload failed"
  onDismiss={() => setShowError(false)}
  onRetry={() => handleUpload()}
/>
```

## Hooks

### useUpload()
Manages upload state and API communication

```tsx
const {
  file,
  jobId,
  status,
  currentStep,
  progress,
  extractedData,
  error,
  selectFile,
  removeFile,
  handleUpload,
  handleDownload,
  handleCancel,
  reset
} = useUpload();
```

## Error Handling

Common errors and handling:

| Error | Cause | Fix |
|-------|-------|-----|
| `Backend unreachable` | Backend not running | Start backend, check NEXT_PUBLIC_API_URL |
| `Invalid PDF` | Corrupted or unsupported PDF | Try different PDF |
| `Timeout` | Processing too slow | Increase timeout, check backend logs |
| `Gemini error` | API quota exceeded | Check Gemini API credits |
| `Network error` | Connection lost | Check internet, retry |

## Testing

### Manual Testing

1. Start frontend: `npm run dev`
2. Start backend: `python main.py`
3. Navigate to http://localhost:3000/upload
4. Select a PDF
5. Click "Upload & Process"
6. Watch processing steps
7. Download Excel

### Automated Testing

```bash
npm run test
```

## Deployment

### Frontend (Vercel)

```bash
npm run build
npm run start
```

Set environment variables in Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### Backend (Heroku/Railway)

Ensure `ALLOWED_ORIGINS` includes frontend URL

## Next Steps (Phase 3)

- [ ] Authentication with OAuth/JWT
- [ ] User accounts and history
- [ ] Subscription/billing
- [ ] Advanced processing options
- [ ] Batch uploads
- [ ] Template builder

## Troubleshooting

### Upload fails silently
- Check browser console for errors
- Verify backend is running
- Check NEXT_PUBLIC_API_URL

### Processing stuck
- Check backend logs
- Verify Gemini API credentials
- Try smaller PDF

### Download doesn't start
- Check if file is generated on backend
- Verify download URL is valid
- Check browser download settings

## Support

For issues or questions:
- GitHub Issues: [repo]/issues
- Email: support@docmorph.ai
- Discord: [invite link]
