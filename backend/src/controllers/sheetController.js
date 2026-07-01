const Problem = require('../models/Problem');
const { updateReadinessScore } = require('./problemController');

const COMPANY_TEMPLATES = {
  google: [
    { title: 'Two Sum', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/two-sum' },
    { title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', link: 'https://leetcode.com/problems/add-two-numbers' },
    { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays' },
    { title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/trapping-rain-water' },
    { title: 'Longest Common Prefix', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/longest-common-prefix' },
    { title: 'Palindrome Number', difficulty: 'Easy', topic: 'Math', link: 'https://leetcode.com/problems/palindrome-number' },
    { title: 'Merge Sorted Array', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/merge-sorted-array' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },
    { title: '3Sum', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/3sum' },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' },
    { title: 'Create Hello World Function', difficulty: 'Easy', topic: 'General', link: 'https://leetcode.com/problems/create-hello-world-function' },
    { title: 'Merge Strings Alternately', difficulty: 'Easy', topic: 'Two Pointers', link: 'https://leetcode.com/problems/merge-strings-alternately' },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Two Pointers', link: 'https://leetcode.com/problems/longest-palindromic-substring' },
    { title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/longest-consecutive-sequence' },
    { title: 'Recyclable and Low Fat Products', difficulty: 'Easy', topic: 'Database', link: 'https://leetcode.com/problems/recyclable-and-low-fat-products' },
    { title: 'Container With Most Water', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/container-with-most-water' }
  ],
  amazon: [
    { title: 'Two Sum', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/two-sum' },
    { title: 'LRU Cache', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/lru-cache' },
    { title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/trapping-rain-water' },
    { title: 'Number of Islands', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/number-of-islands' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock' },
    { title: 'Group Anagrams', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/group-anagrams' },
    { title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', link: 'https://leetcode.com/problems/add-two-numbers' },
    { title: 'Reorganize String', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/reorganize-string' },
    { title: '3Sum', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/3sum' },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Two Pointers', link: 'https://leetcode.com/problems/longest-palindromic-substring' },
    { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/merge-intervals' },
    { title: 'Container With Most Water', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/container-with-most-water' },
    { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays' },
    { title: 'Koko Eating Bananas', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/koko-eating-bananas' },
    { title: 'Valid Parentheses', difficulty: 'Easy', topic: 'String', link: 'https://leetcode.com/problems/valid-parentheses' }
  ],
  microsoft: [
    { title: 'Two Sum', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/two-sum' },
    { title: 'Merge Sorted Array', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/merge-sorted-array' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },
    { title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', link: 'https://leetcode.com/problems/add-two-numbers' },
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Two Pointers', link: 'https://leetcode.com/problems/longest-palindromic-substring' },
    { title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/trapping-rain-water' },
    { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/merge-intervals' },
    { title: 'Valid Parentheses', difficulty: 'Easy', topic: 'String', link: 'https://leetcode.com/problems/valid-parentheses' },
    { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays' },
    { title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/maximum-subarray' },
    { title: '3Sum', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/3sum' },
    { title: 'Group Anagrams', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/group-anagrams' },
    { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array' },
    { title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topic: 'Linked List', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group' },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', link: 'https://leetcode.com/problems/merge-two-sorted-lists' },
    { title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/spiral-matrix' }
  ],
  cisco: [
    { title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Two Pointers', link: 'https://leetcode.com/problems/longest-palindromic-substring' },
    { title: 'Predict the Winner', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/predict-the-winner' },
    { title: 'House Robber', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/house-robber' },
    { title: 'Lucky Numbers in a Matrix', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/lucky-numbers-in-a-matrix' },
    { title: 'Rotate Image', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/rotate-image' },
    { title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/spiral-matrix' },
    { title: 'Fizz Buzz', difficulty: 'Easy', topic: 'Math', link: 'https://leetcode.com/problems/fizz-buzz' },
    { title: 'LRU Cache', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/lru-cache' },
    { title: 'Snakes and Ladders', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/snakes-and-ladders' },
    { title: 'Number of Valid Words in a Sentence', difficulty: 'Easy', topic: 'String', link: 'https://leetcode.com/problems/number-of-valid-words-in-a-sentence' },
    { title: 'Find Third Transaction', difficulty: 'Medium', topic: 'Database', link: 'https://leetcode.com/problems/find-third-transaction' },
    { title: 'Maximum Difference Between Increasing Elements', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/maximum-difference-between-increasing-elements' },
    { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/merge-intervals' },
    { title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/maximum-subarray' },
    { title: 'Implement Router', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/implement-router' },
    { title: 'Find the Largest Area of Square Inside Two Rectangles', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/find-the-largest-area-of-square-inside-two-rectangles' }
  ],
  adobe: [
    { title: 'Two Sum', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/two-sum' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },
    { title: 'Group Anagrams', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/group-anagrams' },
    { title: 'Majority Element', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/majority-element' },
    { title: 'Special Binary String', difficulty: 'Hard', topic: 'String', link: 'https://leetcode.com/problems/special-binary-string' },
    { title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', link: 'https://leetcode.com/problems/add-two-numbers' },
    { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays' },
    { title: '3Sum', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/3sum' },
    { title: 'Climbing Stairs', difficulty: 'Easy', topic: 'Math', link: 'https://leetcode.com/problems/climbing-stairs' },
    { title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', link: 'https://leetcode.com/problems/reverse-linked-list' },
    { title: 'Smallest Range II', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/smallest-range-ii' },
    { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/merge-intervals' },
    { title: 'Nim Game', difficulty: 'Easy', topic: 'Math', link: 'https://leetcode.com/problems/nim-game' },
    { title: 'Number of Increasing Paths in a Grid', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/number-of-increasing-paths-in-a-grid' },
    { title: 'Divide Intervals Into Minimum Number of Groups', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups' },
    { title: 'LRU Cache', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/lru-cache' }
  ],
  uber: [
    { title: 'Bus Routes', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/bus-routes' },
    { title: 'Alien Dictionary', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/alien-dictionary' },
    { title: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit' },
    { title: 'Number of Islands', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/number-of-islands' },
    { title: 'Number of Islands II', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/number-of-islands-ii' },
    { title: 'Squares of a Sorted Array', difficulty: 'Easy', topic: 'Array', link: 'https://leetcode.com/problems/squares-of-a-sorted-array' },
    { title: 'Construct Quad Tree', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/construct-quad-tree' },
    { title: 'Kth Smallest Element in a BST', difficulty: 'Medium', topic: 'Tree', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst' },
    { title: 'First Unique Number', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/first-unique-number' },
    { title: 'Find the Closest Palindrome', difficulty: 'Hard', topic: 'Math', link: 'https://leetcode.com/problems/find-the-closest-palindrome' },
    { title: 'Word Search', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/word-search' },
    { title: 'LRU Cache', difficulty: 'Medium', topic: 'Hash Table', link: 'https://leetcode.com/problems/lru-cache' },
    { title: 'Insert Delete GetRandom O(1)', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/insert-delete-getrandom-o1' },
    { title: 'Design Hit Counter', difficulty: 'Medium', topic: 'Array', link: 'https://leetcode.com/problems/design-hit-counter' },
    { title: 'Word Search II', difficulty: 'Hard', topic: 'Array', link: 'https://leetcode.com/problems/word-search-ii' },
    { title: 'Minimum Edge Reversals So Every Node Is Reachable', difficulty: 'Hard', topic: 'Dynamic Programming', link: 'https://leetcode.com/problems/minimum-edge-reversals-so-every-node-is-reachable' }
  ]
};

const getCompanySheet = async (req, res, next) => {
  try {
    const companyName = req.params.company.toLowerCase();
    const template = COMPANY_TEMPLATES[companyName];

    if (!template) {
      res.statusCode = 404;
      throw new Error(`Company sheet for '${companyName}' not found`);
    }

    const capCompany = companyName.charAt(0).toUpperCase() + companyName.slice(1);

    let userProblems = await Problem.find({
      user: req.user.id,
      companies: { $in: [capCompany] }
    });

    if (userProblems.length === 0) {
      const problemsToCreate = template.map(p => ({
        user: req.user.id,
        title: p.title,
        difficulty: p.difficulty,
        topic: p.topic,
        link: p.link,
        status: 'Todo',
        companies: [capCompany]
      }));

      await Problem.insertMany(problemsToCreate);
      
      await updateReadinessScore(req.user.id);

      userProblems = await Problem.find({
        user: req.user.id,
        companies: { $in: [capCompany] }
      });
    }

    const total = userProblems.length;
    const solved = userProblems.filter(p => p.status === 'Solved').length;
    const attempted = userProblems.filter(p => p.status === 'Attempted').length;
    const todo = userProblems.filter(p => p.status === 'Todo').length;

    const topicMap = {};
    userProblems.forEach(p => {
      topicMap[p.topic] = (topicMap[p.topic] || 0) + 1;
    });

    const topicDistribution = Object.keys(topicMap).map(topic => ({
      topic,
      count: topicMap[topic]
    }));

    res.json({
      success: true,
      company: capCompany,
      progress: {
        total,
        solved,
        attempted,
        todo,
        percentSolved: total > 0 ? Math.round((solved / total) * 100) : 0
      },
      topicDistribution,
      problems: userProblems
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCompanySheet
};
