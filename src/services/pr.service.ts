import axios from 'axios';
import { createPr, getPrReview, getPrStatus, saveReview, updateStatus } from './db.service';
import reviewQueue from '../workers/queue';

// Analyses the PR and saves the result in db. Returns the prId for references.
export const reviewPrService = async (url: string) => {
  console.log(url);
  let pr;

  try {
    // Create a record and update its status to - Processing in db
    pr = await createPr();

    // Enqueue the task for asynchronous processing
    reviewQueue.add({ url, prid: pr?.prid });

    return pr;
  } catch (error) {
    console.error(error);
    throw new Error('Error interacting with the model');
  }
};

// Fetch PR data from GitHub
export const fetchPRData = async (url: string) => {
  try {
    const urlParts = url.split('/');
    const owner = urlParts[3];
    const repo = urlParts[4];
    const pullNumber = urlParts[6];
    const diffUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
    const response = await axios.get(diffUrl, {
      headers: { Accept: 'application/vnd.github.v3.diff' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching PR files:', error);
    throw error;
  }
};

export const getPrStatusService = async (prid: string) => {
  try {
    const status = await getPrStatus(prid);
    return status;
  } catch (error) {
    console.error(error);
    throw new Error('Error in fetching from DB');
  }
};

export const getPrReviewService = async (prid: string) => {
  try {
    const status = await getPrReview(prid);
    return status;
  } catch (error) {
    console.error(error);
    throw new Error('Error in fetching from DB');
  }
};
