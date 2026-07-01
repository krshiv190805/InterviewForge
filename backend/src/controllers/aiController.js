const { GoogleGenAI } = require('@google/genai');
const StudyPlan = require('../models/StudyPlan');

const getGeminiAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const generateHint = async (req, res, next) => {
  try {
    const { title, topic, difficulty } = req.body;

    if (!title) {
      res.statusCode = 400;
      throw new Error('Problem title is required');
    }

    const ai = getGeminiAIClient();

    if (ai) {
      const prompt = `You are an elite DSA coach. Your task is to provide 3 progressive hints for the given problem. Do NOT reveal the actual code solution or the final optimal answer directly. Keep the hints conceptual, helping the user arrive at the answer themselves.
      
      Problem: ${title}
      Topic: ${topic || 'Algorithms'}
      Difficulty: ${difficulty || 'Medium'}
      Provide 3 hints.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const hintsText = response.text;

      return res.json({
        success: true,
        source: 'gemini',
        hints: hintsText.trim()
      });
    }

    const mockHints = [
      `Hint 1: Think about the properties of the data structure involved. Can sorting the input array simplify the relationship between elements?`,
      `Hint 2: Try mapping elements to their frequencies or indices. A Hash Map can often reduce a quadratic search time O(N^2) to linear time O(N).`,
      `Hint 3: Consider edge cases like empty inputs, negative numbers, or arrays with single elements. Can you formulate a recursive relation or sliding window check?`
    ].join('\n\n');

    res.json({
      success: true,
      source: 'simulated',
      hints: `[Simulated Response - Configure GEMINI_API_KEY for Live AI]\n\n${mockHints}`
    });
  } catch (error) {
    next(error);
  }
};

const generateExplanation = async (req, res, next) => {
  try {
    const { title, topic, difficulty } = req.body;

    if (!title) {
      res.statusCode = 400;
      throw new Error('Problem title is required');
    }

    const ai = getGeminiAIClient();

    if (ai) {
      const prompt = `You are an elite software engineering interviewer. Provide a thorough explanation for the problem. Structure your answer clearly with the following sections:
      1. Intuition (how to think about the problem)
      2. Optimal Approach (step-by-step logic)
      3. Time and Space Complexity analysis (Big-O details).
      
      Problem: ${title}
      Topic: ${topic || 'Algorithms'}
      Difficulty: ${difficulty || 'Medium'}
      Generate explanation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const explanationText = response.text;

      return res.json({
        success: true,
        source: 'gemini',
        explanation: explanationText.trim()
      });
    }

    const explanationMarkdown = `### 💡 Intuition
To solve **"${title}"** efficiently, our main goal is to avoid redundant operations. A brute-force traversal would check all combinations, but we can store intermediate computations or use logical pointers to skip unnecessary checks.

### 🚀 Optimal Approach
1. **Initial Checks**: Verify boundaries, null lists, or empty collections.
2. **State Storage**: Utilize a set, map, or constant extra variables to remember elements we have visited.
3. **Traversal**: Iterate through the structure once. Update our state map on the fly.
4. **Result Capture**: Return the accumulated result or position immediately upon finding the target criterion.

### ⏱️ Complexity Analysis
* **Time Complexity:** $O(N)$ because we traverse the collection exactly once, performing constant time $O(1)$ operations at each step.
* **Space Complexity:** $O(N)$ in the worst-case scenario where we store entries for each element in our hash structure.`;

    res.json({
      success: true,
      source: 'simulated',
      explanation: `[Simulated Response - Configure GEMINI_API_KEY for Live AI]\n\n${explanationMarkdown}`
    });
  } catch (error) {
    next(error);
  }
};

const generateMockInterview = async (req, res, next) => {
  try {
    const { targetRole, difficulty } = req.body;

    const ai = getGeminiAIClient();

    if (ai) {
      const prompt = `You are a staff software engineer conducting a technical mock interview. Generate a mock interview questionnaire containing exactly three parts:
      1. A Coding/DSA Question (state the problem and inputs)
      2. A CS Fundamentals Question (focused on OS, DBMS, or Computer Networks)
      3. A Behavioral Question (STAR format based, e.g. conflict, prioritization).
      
      Role: ${targetRole || 'Software Engineer Intern'}
      Difficulty: ${difficulty || 'Medium'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const interviewText = response.text;

      return res.json({
        success: true,
        source: 'gemini',
        interviewSet: interviewText.trim()
      });
    }

    const mockInterview = `### 💻 Part 1: Coding (DSA)
**Problem:** Valid Sudoku (Medium)
Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules:
* Each row must contain the digits 1-9 without repetition.
* Each column must contain the digits 1-9 without repetition.
* Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.

### 🖥️ Part 2: CS Fundamentals (Operating Systems)
**Question:** Explain the difference between a process and a thread. How do they share memory, and what are the primary synchronization issues that arise when threads write to shared regions?

### 👥 Part 3: Behavioral (STAR Method)
**Question:** Tell me about a time you worked on a project with tight deadlines. How did you prioritize your tasks, manage stress, and communicate delays or issues with team members?`;

    res.json({
      success: true,
      source: 'simulated',
      interviewSet: `[Simulated Response - Configure GEMINI_API_KEY for Live AI]\n\n${mockInterview}`
    });
  } catch (error) {
    next(error);
  }
};

const evaluateInterview = async (req, res, next) => {
  try {
    const { interviewSet, userAnswers } = req.body;

    if (!userAnswers || !userAnswers.trim()) {
      res.statusCode = 400;
      throw new Error('User answers are required for evaluation.');
    }

    const ai = getGeminiAIClient();

    if (ai) {
      const prompt = `You are a technical interviewer evaluating a candidate's responses.
      Here are the questions asked:
      ${interviewSet}
      
      Here are the candidate's answers:
      ${userAnswers}
      
      Please review their answers. Provide constructive feedback on each of the parts: Coding/DSA, CS Fundamentals, and Behavioral.
      At the end of your feedback, provide an Overall Rating as a score out of 10 (e.g. "Overall Rating: 7.5/10").
      Format the response in clean markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const feedbackText = response.text;

      return res.json({
        success: true,
        source: 'gemini',
        feedback: feedbackText.trim()
      });
    }

    const text = userAnswers.trim();
    const wordCount = text.split(/\s+/).length;
    let rating = 1.0;
    let feedback = '';

    if (wordCount < 6) {
      rating = 2.0;
      feedback = `### 🌟 Performance Feedback Summary

* **Part 1 (Coding/DSA):** Your answer is too brief to evaluate. Please provide details on your coding logic or data structure selection.
* **Part 2 (CS Fundamentals):** No explanation of concepts like threads, processes, or scheduling was found.
* **Part 3 (Behavioral):** No behavioral response detail. Try using the STAR method (Situation, Task, Action, Result).

**Overall Rating:** ${rating}/10 - Answer is too brief. Provide a comprehensive explanation to get a detailed score report.`;
    } else if (wordCount < 20) {
      rating = 4.5;
      feedback = `### 🌟 Performance Feedback Summary

* **Part 1 (Coding/DSA):** You provided a high-level summary but lacked technical depth or complexity analysis.
* **Part 2 (CS Fundamentals):** Mentioned basic elements, but failed to clarify memory sharing differences or synchronization hazards.
* **Part 3 (Behavioral):** The answer did not follow the STAR framework. Elaborate on what actions you took and the results achieved.

**Overall Rating:** ${rating}/10 - Needs Improvement. Try writing multi-sentence details for each section.`;
    } else {
      let score = 5.0;
      const lowerText = text.toLowerCase();
      
      if (lowerText.includes('set') || lowerText.includes('map') || lowerText.includes('hash') || lowerText.includes('array')) score += 1.0;
      if (lowerText.includes('process') || lowerText.includes('thread') || lowerText.includes('memory') || lowerText.includes('share')) score += 1.0;
      if (lowerText.includes('star') || lowerText.includes('situation') || lowerText.includes('action') || lowerText.includes('result') || lowerText.includes('time') || lowerText.includes('project')) score += 1.0;
      
      rating = Math.min(9.5, score + (wordCount > 100 ? 1.0 : 0.5));
      rating = Math.round(rating * 10) / 10; // round to 1 decimal

      feedback = `### 🌟 Performance Feedback Summary

* **Part 1 (Coding/DSA):** Good effort describing the algorithmic logic. You have a reasonable approach, but could benefit from explaining the time and space complexity explicitly ($O(N)$ details).
* **Part 2 (CS Fundamentals):** Valid explanation of process and thread resource sharing. Remember that stack variables are local to threads while the heap is shared.
* **Part 3 (Behavioral):** Described the scenario reasonably well. Try focusing more on the "Action" and "Result" stages of the STAR method to quantify your achievements.

**Overall Rating:** ${rating}/10 - Solid attempt! Continue practicing timed mock tests to improve speed.`;
    }

    res.json({
      success: true,
      source: 'simulated',
      feedback: `[Simulated Response - Configure GEMINI_API_KEY for Live AI]\n\n${feedback}`
    });
  } catch (error) {
    next(error);
  }
};

const generateStudyPlan = async (req, res, next) => {
  try {
    const { durationWeeks, weeksLeft, motive = 'placement', targetCompanies = [], topics = [] } = req.body;
    const finalWeeks = weeksLeft || durationWeeks || 4;

    const ai = getGeminiAIClient();

    let planData;

    if (ai) {
      const prompt = `Create a weekly software engineering study plan tailored for a college student preparing for a target company drive.
      Motive: ${motive === 'internship' ? 'Internship (focus strictly on DSA Round & Project Discussion)' : 'Placement (cover DSA, System Design, Project Discussion, and CS Fundamentals)'}.
      Duration: ${finalWeeks} weeks.
      Target Company: ${targetCompanies.join(', ') || 'Top Tech Companies'}.

      Guidelines:
      1. Allocate the focus of each week according to the motive:
         - If Internship: Allocate weeks to DSA topics (e.g., Arrays, Trees, Dynamic Programming, focusing on Blind 75 / Top 150 patterns) and Web Dev / Project discussions (project dry runs, architecture).
         - If Placement: Cover DSA, System Design (both LLD and HLD concepts), Web Dev / Project discussions, and CS Fundamentals (Operating Systems, DBMS, Networks).
      2. Keep the tasks actionable and time-boxed based on the ${finalWeeks}-week timeline (shorter timeline = higher-yield compact topics, longer timeline = detailed foundational learning).
      3. For each week's tasks, reference specific popular YouTube courses or platforms:
         - For DSA tasks, reference "TakeUForward (Striver's A-Z)", "Love Babbar DSA", or "Apna College DSA".
         - For System Design tasks, reference "Gaurav Sen" or "Coder Army".
         - For CS Fundamentals tasks, reference "Gate Smashers".
         - For Web Dev/Project tasks, reference "Chai aur Code", "Code with Harry", or "Apna College Web Dev".
      
      Format the response as a valid JSON array of weekly blocks, like:
      [
        {
          "week": 1,
          "focus": "Topic name (e.g., Array DSA & React Project Basics)",
          "tasks": [
            "Watch TakeUForward (Striver) for Array basics and solve Blind 75 Array problems.",
            "Watch Chai aur Code to refactor your portfolio project layout.",
            "Study operating systems process states on Gate Smashers."
          ]
        }
      ]
      Only return the JSON. Do not include markdown wraps (like \`\`\`json).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      const planText = response.text;

      try {
        const cleanJson = planText.replace(/```json/g, '').replace(/```/g, '').trim();
        planData = JSON.parse(cleanJson);
      } catch (err) {
        console.error('JSON parsing failed, falling back to simulated generator', err);
      }
    }

    if (!planData) {
      planData = [];
      if (motive === 'internship') {
        const dsaTopics = ['Arrays & Hashing', 'Two Pointers / Sliding Window', 'Linked Lists & Trees', 'Graphs & Backtracking', 'Dynamic Programming & Greedy'];
        for (let w = 1; w <= finalWeeks; w++) {
          const currentTopic = dsaTopics[(w - 1) % dsaTopics.length];
          const tasks = [
            `[DSA] Watch TakeUForward (Striver) playlist on ${currentTopic} and solve related Blind 75 problems.`,
            `[Project] Review your Web Development projects using Hitesh Choudhary (Chai aur Code) code walkthroughs.`,
            `[Revision] Solve 3 Medium problems on Leetcode related to ${currentTopic}.`,
            `[Mock] Practice dry-running your project architecture and database design.`
          ];
          planData.push({
            week: w,
            focus: `${currentTopic} & Project Prep`,
            tasks
          });
        }
      } else {
        const dsaTopics = ['Arrays & Hashing', 'Linked Lists & Stacks', 'Trees & Graphs', 'Dynamic Programming'];
        const sysDesignTopics = ['System Design Basics & Scaling', 'Load Balancers & Caching', 'Database Sharding & Replication', 'Microservices Architecture'];
        const csTopics = ['Operating Systems (Processes & Threads)', 'DBMS (SQL vs NoSQL & Indexing)', 'Computer Networks (TCP/IP & HTTP)', 'Object-Oriented Programming Principles'];
        
        for (let w = 1; w <= finalWeeks; w++) {
          const dsaTopic = dsaTopics[(w - 1) % dsaTopics.length];
          const sdTopic = sysDesignTopics[(w - 1) % sysDesignTopics.length];
          const csTopic = csTopics[(w - 1) % csTopics.length];
          
          const tasks = [
            `[DSA] Study ${dsaTopic} using TakeUForward (Striver) or Love Babbar DSA channels and solve Top 150 Leetcode problems.`,
            `[System Design] Watch Gaurav Sen System Design series on "${sdTopic}".`,
            `[CS Fundamentals] Study "${csTopic}" on Gate Smashers channel.`,
            `[Project] Build and review project modular structures referring to Chai aur Code web dev course.`
          ];
          
          planData.push({
            week: w,
            focus: `${dsaTopic} & ${sdTopic.split(' & ')[0]}`,
            tasks
          });
        }
      }
    }

    const savedPlan = await StudyPlan.create({
      user: req.user.id,
      title: `${targetCompanies.join(', ') || 'Custom'} Prep - ${finalWeeks} Week ${motive === 'internship' ? 'Internship' : 'Placement'} Path`,
      duration: `${finalWeeks} Weeks`,
      motive,
      weeksLeft: finalWeeks,
      targetCompanies,
      topics,
      schedule: planData.map(item => ({
        week: item.week,
        focus: item.focus,
        tasks: item.tasks,
        completedTasks: []
      }))
    });

    res.json({
      success: true,
      plan: savedPlan
    });
  } catch (error) {
    next(error);
  }
};

const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      plans
    });
  } catch (error) {
    next(error);
  }
};

const updateStudyPlanProgress = async (req, res, next) => {
  try {
    const { completedTasks } = req.body; // Array of completed task strings
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user.id });

    if (!plan) {
      res.statusCode = 404;
      throw new Error('Study plan not found');
    }

    const weekItem = plan.schedule.find(w => w.week === Number(req.params.weekNum));
    if (!weekItem) {
      res.statusCode = 400;
      throw new Error('Invalid week index');
    }

    weekItem.completedTasks = completedTasks || [];
    await plan.save();

    res.json({
      success: true,
      plan
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateHint,
  generateExplanation,
  generateMockInterview,
  evaluateInterview,
  generateStudyPlan,
  getStudyPlans,
  updateStudyPlanProgress
};
