import { saveReview, updateStatus } from '../services/db.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fetchPRData } from '../services/pr.service';
import reviewQueue from './queue';

reviewQueue.process(async (job) => {
  console.log("reviewWorker running");
  const { url, prid } = job.data;
  console.log("url: ", url);
  console.log("prid: ", prid);
  const data = await fetchPRData(url);

  try {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      tools: [{ codeExecution: {} }],
    });

    const result = await model.generateContent(`You are a git pull request reviewer. Analyze the 
        given PR and give result only if there are any potential bugs, errors, or formatting errors.
        Focus on the code and files provided. Don't focus on missing test cases if not mentioned 
        in the PR. Don't focus on the missing documentation. Give the specific code line, wherever 
        improvements are suggested. Don't give any additional comments or notes. 
        The PR diff is: ${data}`);

    const response = result.response;
    await saveReview(prid, response.text());
    console.log(`PR Review processed: ${prid}`);
  } catch (error) {
    console.error("Error processing PR review:", error);
    await updateStatus(prid);
  }
});
