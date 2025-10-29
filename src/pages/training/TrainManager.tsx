// src/pages/training/TrainManager.tsx
import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Box, Typography, Paper, Button } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { getJobsForUser, retrainJob } from '../../store/trainingMock';
import LogsDialog from '../../components/training/LogsDialog';
import type { TrainingJob } from '../../store/trainingMock';

export default function TrainManager() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<TrainingJob | null>(null);
  const [logsOpen, setLogsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    refresh();
    const t = setInterval(refresh, 1200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function refresh() {
    if (!user) return;
    setJobs(getJobsForUser(user.role === 'admin' ? undefined : user.id));
  }

  const handleViewLogs = (job: TrainingJob) => {
    setSelectedJob(job);
    setLogsOpen(true);
  };

  const handleRetrain = (job: TrainingJob) => {
    const newJob = retrainJob(job.id);
    if (newJob) {
      // alert(`Retrain job started: ${newJob.id}`);
    } else {
      // alert('Unable to start retrain job.');
    }
    refresh();
  };

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>Training Manager</Typography>

        {jobs.length === 0 ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary">No training jobs found.</Typography>
          </Paper>
        ) : (
          jobs.map((j) => (
            <Paper key={j.id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1">Job {j.id}</Typography>
                <Typography variant="body2" color="text.secondary">{j.status} · {j.progress}% · {new Date(j.updatedAt).toLocaleString()}</Typography>
              </Box>
              <Box>
                <Button sx={{ mr: 1 }} onClick={() => handleViewLogs(j)}>Logs</Button>
                <Button variant="outlined" onClick={() => handleRetrain(j)}>Retrain</Button>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      <LogsDialog open={logsOpen} job={selectedJob ?? undefined} onClose={() => setLogsOpen(false)} />
    </AdminLayout>
  );
}
