import axios from "axios";
import {
  createPr,
  getPrReview,
  getPrStatus,
  saveReview,
  updateStatus,
} from "./db.service";
import { config } from "../config/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Analyses the PR and saves the result in db. Returns the prId for references.
export const reviewPrService = async (url: string) => {
  console.log(url);
  let pr;

  try {
    // Create a record and update its status to - Processing in db
    pr = await createPr();
    // Get the review from the PR
    const data = await fetchPRData(url);
    // Process the review asynchronously
    queryLLM(data, pr);

    return pr;
  } catch (error) {
    console.error(error);
    throw new Error("Error interacting with the model");
  }
};

// Process the review asynchronously
export const queryLLM = async (data: string, pr: any) => {
  try {
    console.log("llm running");
    const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      tools: [
        {
          codeExecution: {},
        },
      ],
    });
    const result = await model.generateContent(
      `You are a git pull request reviewer. Analyze the given PR and give result only
                if there are any potential bugs, errors, or formatting errors. Focus on the code and files provided.
                Don't focus on missing test cases if not mentioned in the PR. Don't focus on the missing
                documentation. Give the specific code line, wherever improvements are suggested.
                Don't give any additional comments or notes. The PR diff is: ${data}`,
    );
    const response = result.response;
    console.log("\n\n\n gemini res: ", response.text());

    if (typeof pr?.prid === "number") {
      await saveReview(pr.prid, response.text());
    }
    console.log("llm done");
  } catch (error) {
    console.error(error);
    if (typeof pr?.prid === "number") updateStatus(pr?.prid);
  }
};

export const fetchPRData = async (url: string) => {
  try {
    const urlParts = url.split("/");
    const owner = urlParts[3];
    const repo = urlParts[4];
    const pullNumber = urlParts[6];
    const diffUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
    const response = await axios.get(diffUrl, {
      headers: { Accept: "application/vnd.github.v3.diff" },
    });
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching PR files:", error);
    throw error;
  }
};

export const getPrStatusService = async (prid: string) => {
  try {
    const status = await getPrStatus(prid);
    return status;
  } catch (error) {
    console.error(error);
    throw new Error("Error in fetching from DB");
  }
};

export const getPrReviewService = async (prid: string) => {
  try {
    const status = await getPrReview(prid);
    return status;
  } catch (error) {
    console.error(error);
    throw new Error("Error in fetching from DB");
  }
};
