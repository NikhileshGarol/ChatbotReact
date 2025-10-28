// src/store/trainingMock.ts
// Mock training store (localStorage-backed), per-user document storage and training jobs.
// Updated to store file content in base64 for previewing.

export type DocStatus = 'pending' | 'training' | 'completed' | 'failed';
export type JobStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export type TrainingDocument = {
  id: string;
  userId: string;
  filename: string;
  title?: string;
  description?: string;
  size?: number; // bytes
  uploadedAt: string;
  status: DocStatus;
  jobId?: string | null;
  contentBase64?: string | null; // base64 payload for preview (client-only)
  mimeType?: string | null; // file mime type, to aid preview
};

export type TrainingJob = {
  id: string;
  userId: string;
  documentIds: string[]; // docs included in job
  status: JobStatus;
  progress: number; // 0-100
  createdAt: string;
  updatedAt: string;
  logs: string[]; // text logs
};

const STORAGE_KEY = 'mock_training_v1';

type DB = {
  documents: TrainingDocument[];
  jobs: TrainingJob[];
};

const defaultDB: DB = {
  documents: [],
  jobs: [],
};

function readDB(): DB {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDB));
      return defaultDB;
    }
    return JSON.parse(raw) as DB;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDB));
    return defaultDB;
  }
}

function writeDB(db: DB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function genId(prefix = 't') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

/* Documents API */
export function getDocumentsForUser(userId?: string) {
  const db = readDB();
  if (!userId) return db.documents;
  return db.documents.filter((d) => d.userId === userId);
}

/**
 * payload includes: filename, title?, description?, size?, contentBase64?, mimeType?
 */
export function addDocumentForUser(
  userId: string,
  payload: { filename: string; title?: string; description?: string; size?: number; contentBase64?: string | null; mimeType?: string | null }
) {
  const db = readDB();
  const newDoc: TrainingDocument = {
    id: genId('doc'),
    userId,
    filename: payload.filename,
    title: payload.title ?? payload.filename,
    description: payload.description ?? '',
    size: payload.size ?? 0,
    uploadedAt: new Date().toISOString(),
    status: 'pending',
    jobId: null,
    contentBase64: payload.contentBase64 ?? null,
    mimeType: payload.mimeType ?? null,
  };
  db.documents = [newDoc, ...db.documents];
  writeDB(db);
  return newDoc;
}

export function deleteDocument(id: string) {
  const db = readDB();
  db.documents = db.documents.filter((d) => d.id !== id);
  // also remove docId references from jobs (for simplicity)
  db.jobs = db.jobs.map((j) => ({ ...j, documentIds: j.documentIds.filter((x) => x !== id) }));
  writeDB(db);
  return true;
}

export function updateDocumentStatus(id: string, status: DocStatus, jobId?: string | null) {
  const db = readDB();
  const idx = db.documents.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  db.documents[idx] = { ...db.documents[idx], status, jobId: jobId ?? db.documents[idx].jobId ?? null };
  writeDB(db);
  return db.documents[idx];
}

/* Jobs API */
export function getJobsForUser(userId?: string) {
  const db = readDB();
  if (!userId) return db.jobs;
  return db.jobs.filter((j) => j.userId === userId);
}

export function startTrainingForUser(userId: string, documentIds: string[]) {
  const db = readDB();
  const jobId = genId('job');
  const now = new Date().toISOString();
  const job: TrainingJob = {
    id: jobId,
    userId,
    documentIds,
    status: 'queued',
    progress: 0,
    createdAt: now,
    updatedAt: now,
    logs: ['Job queued'],
  };
  // attach jobId to documents and mark as training (optimistically)
  db.jobs = [job, ...db.jobs];
  for (const docId of documentIds) {
    const dIdx = db.documents.findIndex((d) => d.id === docId);
    if (dIdx !== -1) {
      db.documents[dIdx] = { ...db.documents[dIdx], status: 'training', jobId };
    }
  }
  writeDB(db);

  // simulate async processing (mock). Use setTimeout.
  setTimeout(() => {
    const db1 = readDB();
    const jobIdx = db1.jobs.findIndex((j) => j.id === jobId);
    if (jobIdx === -1) return;
    db1.jobs[jobIdx].status = 'running';
    db1.jobs[jobIdx].progress = 10;
    db1.jobs[jobIdx].logs.push('Job started');
    db1.jobs[jobIdx].updatedAt = new Date().toISOString();
    writeDB(db1);

    let progress = 10;
    const interval = setInterval(() => {
      const db2 = readDB();
      const ji = db2.jobs.findIndex((j) => j.id === jobId);
      if (ji === -1) {
        clearInterval(interval);
        return;
      }
      progress += Math.floor(Math.random() * 20) + 5;
      if (progress >= 100) {
        const fail = Math.random() < 0.08;
        db2.jobs[ji].progress = 100;
        db2.jobs[ji].status = fail ? 'failed' : 'succeeded';
        db2.jobs[ji].logs.push(fail ? 'Job failed due to internal error' : 'Job completed successfully');
        db2.jobs[ji].updatedAt = new Date().toISOString();

        for (const docId of db2.jobs[ji].documentIds) {
          const dIdx = db2.documents.findIndex((d) => d.id === docId);
          if (dIdx !== -1) {
            db2.documents[dIdx] = { ...db2.documents[dIdx], status: fail ? 'failed' : 'completed' };
          }
        }

        writeDB(db2);
        clearInterval(interval);
        return;
      } else {
        db2.jobs[ji].progress = Math.min(progress, 99);
        db2.jobs[ji].logs.push(`Progress updated to ${db2.jobs[ji].progress}%`);
        db2.jobs[ji].updatedAt = new Date().toISOString();
        writeDB(db2);
      }
    }, 900);
  }, 800);

  return job;
}

export function retrainJob(jobId: string) {
  const db = readDB();
  const j = db.jobs.find((x) => x.id === jobId);
  if (!j) return null;
  return startTrainingForUser(j.userId, j.documentIds);
}
