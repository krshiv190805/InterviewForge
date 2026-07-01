const Problem = require('../models/Problem');
const User = require('../models/User');

const updateReadinessScore = async (userId) => {
  try {
    const problems = await Problem.find({ user: userId });
    const total = problems.length;
    if (total === 0) {
      await User.findByIdAndUpdate(userId, { readinessScore: 0 });
      return 0;
    }

    const solved = problems.filter(p => p.status === 'Solved');
    const easySolved = solved.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solved.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solved.filter(p => p.difficulty === 'Hard').length;

    const rawScore = (easySolved * 2) + (mediumSolved * 4) + (hardSolved * 6);
    const score = Math.min(100, Math.round(rawScore * 2.5));

    await User.findByIdAndUpdate(userId, { readinessScore: score });
    return score;
  } catch (error) {
    console.error('Error updating readiness score:', error);
  }
};

const getProblems = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, difficulty, status, topic, company } = req.query;
    const query = { user: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }
    if (status) {
      query.status = status;
    }
    if (topic) {
      query.topic = { $regex: topic, $options: 'i' };
    }
    if (company) {
      query.companies = { $in: [new RegExp(company, 'i')] };
    }

    const total = await Problem.countDocuments(query);
    const problems = await Problem.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      count: problems.length,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      totalProblems: total,
      problems
    });
  } catch (error) {
    next(error);
  }
};

const getProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, user: req.user.id });

    if (!problem) {
      res.statusCode = 404;
      throw new Error('Problem not found');
    }

    res.json({
      success: true,
      problem
    });
  } catch (error) {
    next(error);
  }
};

const createProblem = async (req, res, next) => {
  try {
    const { title, difficulty, topic, status, companies, link, notes, codeSolution } = req.body;

    if (!title || !difficulty || !topic) {
      res.statusCode = 400;
      throw new Error('Please include title, difficulty, and topic');
    }

    const problem = await Problem.create({
      user: req.user.id,
      title,
      difficulty,
      topic,
      status: status || 'Todo',
      companies: companies || [],
      link: link || '',
      notes: notes || '',
      codeSolution: codeSolution || ''
    });

    await updateReadinessScore(req.user.id);

    res.status(201).json({
      success: true,
      problem
    });
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    let problem = await Problem.findOne({ _id: req.params.id, user: req.user.id });

    if (!problem) {
      res.statusCode = 404;
      throw new Error('Problem not found');
    }

    const fieldsToUpdate = req.body;
    
    problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    );

    await updateReadinessScore(req.user.id);

    res.json({
      success: true,
      problem
    });
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, user: req.user.id });

    if (!problem) {
      res.statusCode = 404;
      throw new Error('Problem not found');
    }

    await Problem.findByIdAndDelete(req.params.id);
    await updateReadinessScore(req.user.id);

    res.json({
      success: true,
      message: 'Problem removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblems,
  getProblem,
  createProblem,
  updateProblem,
  deleteProblem,
  updateReadinessScore
};
