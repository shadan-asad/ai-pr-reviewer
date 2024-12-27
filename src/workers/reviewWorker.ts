import { saveReview, updateStatus } from '../services/db.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchPRData } from '../services/pr.service';
import reviewQueue from './queue';
import { config } from '../config/config';

reviewQueue.process(async (job) => {
  console.log("reviewWorker running");
  const { url, prid } = job.data;
  console.log("url: ", url);
  console.log("prid: ", prid);

  try {
    // Get data from the PR
    const data = await fetchPRData(url);
    
    const genAI = new GoogleGenerativeAI(config.apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      tools: [{ codeExecution: {} }],
    });

    const result = await model.generateContent(`You are a git pull request reviewer. Analyze the 
        given PR and give result only if there are any potential bugs, errors, or formatting errors.
        Focus on the code and files provided. Don't focus on missing test cases if not mentioned 
        in the PR. Don't focus on the missing documentation. Give the specific code line, wherever 
        improvements are suggested. Don't give any additional comments or notes.
        Give the suggestins in a json format. Use one object for each file.
        The PR diff is: ${data}`);

    console.log("result: ", result);
    const response = result.response;
    await saveReview(prid, response.text());
    console.log(`PR Review processed: ${prid}`);
  } catch (error) {
    console.error("Error processing PR review:", error);
    await updateStatus(prid);
  }
});
