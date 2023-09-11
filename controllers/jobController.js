import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment/moment.js";

// ============ Create Job ===============
export const createJobController = async (req, res, next) => {
  try {
    const { company, position } = req.body;
    if ((!company, !position)) {
      next("Please provide all the fields...!");
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    next(error);
  }
};

// ============Get All Jobs created by a single user =============
export const getAllJobsController = async (req, res, next) => {
  try {
    // Search by string query
    const { status, workLocation, workType, sort } = req.query;

    // Create query object
    const queryObject = {
      createdBy: req.user.userId,
    };

    // Filter logic by status
    if (status && status !== "all") {
      queryObject.status = status;
    }
    // search by work location
    if (workLocation && workLocation !== "all") {
      queryObject.workLocation = workLocation;
    }
    // Search by work type
    if (workType && workType !== "all") {
      queryObject.workType = workType;
    }
    let queryResult = jobsModel.find(queryObject);

    // Sorting the document w.r.t latest jobs
    if (sort === "latest") {
      queryResult = queryResult.sort("-createdAt");
    }
    // Sorting the document w.r.t oldest jobs
    if (sort === "oldest") {
      queryResult = queryResult.sort("createdAt");
    }

    // sorting the document w.r.t ascending order
    if (sort === "a-z") {
      queryResult = queryResult.sort("position");
    }

    // sorting the document w.r.t ascending order
    if (sort === "z-a") {
      queryResult = queryResult.sort("-position");
    }

    // Pagination
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);
    // total jobs count
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numberOfPages = Math.ceil(totalJobs / limit);
    const jobs = await queryResult;

    // const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(201).json({
      totalJobs: jobs.length,
      totalJobs,
      jobs,
      numberOfPages,
    });
  } catch (error) {
    next(error);
  }
};

// ======Update specific job ===========

export const updateJobController = async (req, res, next) => {
  try {
    // Getting the user id and inputs
    const { id } = req.params;
    const { company, position } = req.body;

    // Validate the request
    if (!company || !position) {
      next("Please provide all fields...!");
    }

    // Find specific job
    const job = await jobsModel.findOne({ _id: id });
    if (!job) {
      next(`No job found with this id: ${id}`);
    }

    //  To check if the requested user is valid or not
    if (!req.user.userId === job.createdBy.toString()) {
      next("No Authorized user please try again...!");
      return;
    }

    // update the job
    const updatedJob = await jobsModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });

    // Send response
    res.status(200).json({
      success: true,
      message: "Job updated successfully.",
      updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// ======Delete specific job ===========

export const deleteJobController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await jobsModel.findOne({ _id: id });
    //validation
    if (!job) {
      next(`No Job Found With This ID ${id}`);
    }
    if (!req.user.userId === job.createdBy.toString()) {
      next("Your Not Authorize to delete this job");
      return;
    }
    await job.deleteOne();
    res.status(200).json({
      success: true,
      message: "Job post deleted successfully.",
      job,
    });
  } catch (error) {
    next(error);
  }
};

// ======Get job stats specific job ===========

export const getJobStatsController = async (req, res, next) => {
  try {
    const stats = await jobsModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    //   Monthly Stats && Yearly stats
    const monthlyStats = await jobsModel.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.user.userId),
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Format the aggregation result using moment.js
    const formattedResult = monthlyStats.map((item) => ({
      date: moment({
        year: item._id.year,
        month: item._id.month - 1,
        day: 1,
      }).format("MMMM YYYY"),
      count: item.count,
    }));

    // const defaultStats = {
    //     pending: stats.pending || 0,
    //     interview: stats.interview || 0,
    //     reject: stats.reject || 0
    // }
    res.status(200).json({
      totalJobs: stats.length,
      formattedResult,
      stats,
    });
  } catch (error) {
    next(error);
  }
};
