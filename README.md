# AI Pull Request Reviewer

AI Pull Request Reviewer is a cutting-edge Node.js-based application that uses AI to review pull requests. By accepting a URL for a pull request, it analyzes the files and code, providing feedback on errors, code formatting, and potential issues. The application uses the Gemini model for the analysis and Redis for queue management.

## Live Endpoints
- **GET Status**: https://ai-pr-reviewer.onrender.com/status/39
- **GET Result**: https://ai-pr-reviewer.onrender.com/result/39
- **POST Review**: https://ai-pr-reviewer.onrender.com/review?url=https://github.com/shadan-asad/ai-pr-reviewer/pull/4

## Features
- **Pull Request Analysis**: Automatically reviews pull requests and provides AI-driven feedback.
- **Error Detection**: Identifies syntax and runtime errors in the code.
- **Code Formatting**: Ensures the code follows the specified coding standards and formats it accordingly.
- **Potential Issues**: Highlights potential issues and best practices violations.
- **Asynchronous Processing**: Uses Redis to queue and process pull requests asynchronously for efficient handling.

## Benefits of Using Artificial Intelligence
- **Efficiency**: Automates the code review process, saving valuable time for developers.
- **Consistency**: Provides consistent feedback, eliminating human error and subjectivity.
- **Insight**: Leverages advanced models to identify subtle issues and provide detailed analysis.
- **Scalability**: Easily scales to review multiple pull requests simultaneously.

## API Endpoints

### 1. POST /review?url=pull-request-url
- **Description**: This endpoint takes the URL of your pull request, processes the review asynchronously, saves the review in the database, and returns a "prid" (pull request ID) for reference.
- **Parameters**: 
  - `url` (string): The URL of the pull request.
- **Response**: 
  - `prid` (string): The pull request ID for fetching the review status and result.

### 2. GET /status/{prid}
- **Description**: This endpoint takes a `prid` and gives the current status of the review, which can be "processing", "success", or "failed".
- **Parameters**: 
  - `prid` (string): The pull request ID.
- **Response**: 
  - `status` (string): The current status of the review.

### 3. GET /result/{prid}
- **Description**: This endpoint takes the `prid` and returns the review if found in the database.
- **Parameters**: 
  - `prid` (string): The pull request ID.
- **Response**: 
  - `review` (object): The review data for the pull request.


## Prerequisites
- Node.js (>= 18.x)
- PostgreSQL
- Redis
- Gemini API Key for code analysis.

## Installation

### Clone the Repository
```bash
git clone https://github.com/shadan-asad/ai-pr-reviewer.git
cd ai-pr-reviewer
npm install
```

## Set Up Environment Variables
Create a .env file in the root directory and add the following variables:
```
API_KEY=your_gemini_api_key
DB_URL=postgresql://username:password@localhost:5432/mydb
REDIS_URL=your-redis-url
```
## Run the worker
```
npm run start-worker
```

## Run the project
```
npm run dev
```
