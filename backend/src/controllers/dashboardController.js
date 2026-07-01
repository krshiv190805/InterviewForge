const Problem = require('../models/Problem');
const Revision = require('../models/Revision');
const User = require('../models/User');

const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }

    const problems = await Problem.find({ user: userId });
    const totalCount = problems.length;
    const solvedProblems = problems.filter(p => p.status === 'Solved');
    const attemptedCount = problems.filter(p => p.status === 'Attempted').length;
    const todoCount = problems.filter(p => p.status === 'Todo').length;

    const easySolved = solvedProblems.filter(p => p.difficulty === 'Easy').length;
    const mediumSolved = solvedProblems.filter(p => p.difficulty === 'Medium').length;
    const hardSolved = solvedProblems.filter(p => p.difficulty === 'Hard').length;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const solvedThisWeekCount = solvedProblems.filter(p => p.updatedAt >= sevenDaysAgo).length;

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const revisionCount = await Revision.countDocuments({
      user: userId,
      nextRevisionDate: { $lte: todayEnd }
    });

    const upcomingContests = [
      { id: '1', platform: 'LeetCode', name: 'Weekly Contest 410', date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleString() },
      { id: '2', platform: 'LeetCode', name: 'Biweekly Contest 136', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleString() },
      { id: '3', platform: 'Codeforces', name: 'Div. 2 Round 982', date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleString() }
    ];

    const difficultyDistribution = [
      { name: 'Easy', solved: easySolved, total: problems.filter(p => p.difficulty === 'Easy').length },
      { name: 'Medium', solved: mediumSolved, total: problems.filter(p => p.difficulty === 'Medium').length },
      { name: 'Hard', solved: hardSolved, total: problems.filter(p => p.difficulty === 'Hard').length }
    ];

    res.json({
      success: true,
      metrics: {
        totalProblems: totalCount,
        solvedProblemsCount: solvedProblems.length,
        attemptedCount,
        todoCount,
        streak: user.streak,
        readinessScore: user.readinessScore,
        weeklyGoal: user.weeklyGoal,
        solvedThisWeek: solvedThisWeekCount,
        revisionDueToday: revisionCount
      },
      difficultyDistribution,
      upcomingContests
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData
};
