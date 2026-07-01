const Revision = require('../models/Revision');
const Problem = require('../models/Problem');

const getRevisions = async (req, res, next) => {
  try {
    const { due } = req.query;
    const query = { user: req.user.id };

    if (due === 'true') {
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      query.nextRevisionDate = { $lte: todayEnd };
    }

    const revisions = await Revision.find(query)
      .populate('problem')
      .sort({ nextRevisionDate: 1 });

    res.json({
      success: true,
      count: revisions.length,
      revisions
    });
  } catch (error) {
    next(error);
  }
};

const createOrUpdateRevision = async (req, res, next) => {
  try {
    const { problemId, quality } = req.body; // quality: 0 to 5

    if (quality === undefined || quality < 0 || quality > 5) {
      res.statusCode = 400;
      throw new Error('Please provide a feedback quality score between 0 and 5');
    }

    const problem = await Problem.findOne({ _id: problemId, user: req.user.id });
    if (!problem) {
      res.statusCode = 404;
      throw new Error('Problem not found');
    }

    let revision = await Revision.findOne({ user: req.user.id, problem: problemId });

    let repetitions = 0;
    let interval = 1;
    let easeFactor = 2.5;

    if (revision) {
      repetitions = revision.repetitions;
      interval = revision.interval;
      easeFactor = revision.easeFactor;
    }

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    const qDiff = 5 - quality;
    easeFactor = easeFactor + (0.1 - qDiff * (0.08 + qDiff * 0.02));
    if (easeFactor < 1.3) {
      easeFactor = 1.3;
    }

    const nextRevisionDate = new Date();
    nextRevisionDate.setDate(nextRevisionDate.getDate() + interval);
    nextRevisionDate.setHours(0, 0, 0, 0); // start of the day

    if (revision) {
      revision.repetitions = repetitions;
      revision.interval = interval;
      revision.easeFactor = easeFactor;
      revision.nextRevisionDate = nextRevisionDate;
      await revision.save();
    } else {
      revision = await Revision.create({
        user: req.user.id,
        problem: problemId,
        repetitions,
        interval,
        easeFactor,
        nextRevisionDate
      });
    }

    await revision.populate('problem');

    res.json({
      success: true,
      message: `Revision scheduled in ${interval} days.`,
      revision
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRevisions,
  createOrUpdateRevision
};
