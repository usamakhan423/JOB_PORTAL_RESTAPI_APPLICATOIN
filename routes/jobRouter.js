import express from 'express';
import authUser from '../middlewares/authMiddleware.js';
import { createJobController, deleteJobController, getAllJobsController, getJobStatsController, updateJobController } from '../controllers/jobController.js';

const router = express.Router();

// Create Job || POST
router.post('/create-job', authUser, createJobController);

// Get all Jobs
router.get('/get-jobs', authUser, getAllJobsController);

// Update specific job || PUT REQUEST
router.put('/update-job/:id', authUser, updateJobController)

// Delete a specific job || DELETE REQUEST
router.delete('/delete-job/:id', authUser, deleteJobController);

// Get job stats || GET REQUEST
router.get('/job-stats', authUser, getJobStatsController);

export default router;