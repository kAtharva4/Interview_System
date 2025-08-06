import { useState } from "react";
import { callGeminiAPI } from "../utils/api";
import { useLanguage } from "../hooks/useLanguage";
import { saveAnswerToDatabase } from "../utils/serverHelpers";
import { saveAnswerToDatabaseWithFallback } from "../utils/serverHelpers";
// const CodingStyles = `
import "./Coding.css";
// `;

export default function Coding() {
  const { currentLanguage, t } = useLanguage();
  const [language, setLanguage] = useState("javascript");
  const [difficulty, setDifficulty] = useState("easy");
  const [problems, setProblems] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateProblems = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate 3 coding problems in ${language} at ${difficulty} level.
        Each problem should include:
        - Problem statement (2-3 paragraphs)
        - 2-3 sample test cases with inputs and expected outputs
        - Constraints
        
        Format exactly as:
        Problem 1:
        [problem statement]
        Sample Input 1: [input]
        Expected Output 1: [output]
        Sample Input 2: [input]
        Expected Output 2: [output]
        Constraints: [constraints]
        ---`;

      const response = await callGeminiAPI(prompt);
      const parsedProblems = parseProblems(response);
      setProblems(parsedProblems);
      setSolutions(Array(parsedProblems.length).fill(""));
      setFeedback([]);
    } catch (error) {
      console.error("Error generating problems:", error);
      alert(t("Failed to generate problems"));
    } finally {
      setIsLoading(false);
    }
  };

  const parseProblems = (text) => {
    return text
      .split("---")
      .filter((block) => block.trim() !== "")
      .map((block, index) => {
        const lines = block.split("\n").filter((line) => line.trim() !== "");
        const problem = {
          id: `code-${Date.now()}-${index}`,
          statement: "",
          testCases: [],
          constraints: "",
        };

        let currentSection = "statement";
        lines.forEach((line) => {
          if (line.startsWith("Sample Input")) {
            currentSection = "testCases";
            const caseNum = line.match(/\d+/)[0];
            const input = line.replace(`Sample Input ${caseNum}:`, "").trim();
            problem.testCases.push({ input, output: "" });
          } else if (line.startsWith("Expected Output")) {
            const caseNum = line.match(/\d+/)[0];
            problem.testCases[caseNum - 1].output = line
              .replace(`Expected Output ${caseNum}:`, "")
              .trim();
          } else if (line.startsWith("Constraints:")) {
            currentSection = "constraints";
            problem.constraints = line.replace("Constraints:", "").trim();
          } else {
            if (currentSection === "statement") {
              problem.statement += line + "\n";
            } else if (currentSection === "constraints") {
              problem.constraints += line + "\n";
            }
          }
        });

        return problem;
      });
  };

  const handleSolutionChange = (index, value) => {
    const newSolutions = [...solutions];
    newSolutions[index] = value;
    setSolutions(newSolutions);
  };

  const submitSolution = async (index) => {
    if (!solutions[index]) {
      alert(t("Please write a solution before submitting"));
      return;
    }

    setIsLoading(true);
    try {
      const problem = problems[index];
      const prompt = `Evaluate this ${language} solution:
      Problem: ${problem.statement}
      Solution: ${solutions[index]}
      
      Provide feedback in this format:
      Score: [score]/10
      Feedback: [detailed feedback]
      Expected Solution: [well-formatted code solution]`;

      const response = await callGeminiAPI(prompt, "feedback");
      const parsedFeedback = parseFeedback(response);

      // ✅ Save answer and feedback to DB
      try {
        await saveAnswerToDatabase({
          question: problem.statement,
          userAnswer: solutions[index],
          category: "coding",
          topic: problem.topic || "general",
          feedback: parsedFeedback,
        });
        
      } catch (dbErr) {
        console.error(
          `Failed to save coding solution for P${index + 1}:`,
          dbErr
        );
      }

      const newFeedback = [...feedback];
      newFeedback[index] = parsedFeedback;
      setFeedback(newFeedback);
    } catch (error) {
      console.error("Error evaluating solution:", error);
      alert(t("Failed to evaluate solution"));
    } finally {
      setIsLoading(false);
    }
  };

  const parseFeedback = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const feedback = {
      score: 0,
      feedback: "",
      expectedSolution: "",
    };

    let currentSection = "";
    lines.forEach((line) => {
      if (line.startsWith("Score:")) {
        feedback.score = parseInt(line.match(/\d+/)?.[0] || 0);
      } else if (line.startsWith("Feedback:")) {
        currentSection = "feedback";
        feedback.feedback = line.replace("Feedback:", "").trim();
      } else if (line.startsWith("Expected Solution:")) {
        currentSection = "expectedSolution";
        feedback.expectedSolution = line
          .replace("Expected Solution:", "")
          .trim();
      } else {
        if (currentSection === "feedback") {
          feedback.feedback += "\n" + line.trim();
        } else if (currentSection === "expectedSolution") {
          feedback.expectedSolution += "\n" + line.trim();
        }
      }
    });

    return feedback;
  };

  return (
    <>
      {/* <style dangerouslySetInnerHTML={{ __html: CodingStyles }} /> */}
      <div className="coding-page fade-in">
        <div className="coding-card">
          <h1 className="coding-card-title">{t("Coding Practice")}</h1>

          <div className="coding-flex coding-flex-col md:coding-flex-row coding-gap-4 coding-mb-6">
            <div className="coding-card">
              <h2 className="coding-form-label">{t("Select Language")}</h2>
              <select
                className="coding-form-control coding-form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c++">C++</option>
              </select>
            </div>

            <div className="coding-card">
              <h2 className="coding-form-label">{t("Select Difficulty")}</h2>
              <select
                className="coding-form-control coding-form-select"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">{t("Easy")}</option>
                <option value="medium">{t("Medium")}</option>
                <option value="hard">{t("Hard")}</option>
              </select>
            </div>
          </div>

          <button
            className="coding-btn coding-btn-primary coding-w-full"
            onClick={generateProblems}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="coding-spinner"></span>
            ) : (
              t("Generate Problems")
            )}
          </button>
        </div>

        {problems.length > 0 && (
          <div className="coding-space-y-6">
            {problems.map((problem, index) => (
              <div
                key={problem.id}
                className={`coding-problem-card coding-lang-${language
                  .toLowerCase()
                  .replace("+", "")}`}
              >
                <div className="coding-problem-header">
                  <h3 className="coding-problem-text">
                    {t("Problem")} {index + 1}:\n{problem.statement}
                  </h3>
                </div>

                {problem.testCases.length > 0 && (
                  <div className="coding-mt-4">
                    <h4 className="coding-font-semibold">{t("Test Cases")}</h4>
                    {problem.testCases.map((testCase, i) => (
                      <div key={i} className="coding-test-case coding-mt-2">
                        <p>Input: {testCase.input}</p>
                        <p>Output: {testCase.output}</p>
                      </div>
                    ))}
                  </div>
                )}

                {problem.constraints && (
                  <div className="coding-mt-4">
                    <h4 className="coding-font-semibold">{t("Constraints")}</h4>
                    <p className="coding-whitespace-pre-wrap">
                      {problem.constraints}
                    </p>
                  </div>
                )}

                <div className="coding-input-group coding-mt-4">
                  <textarea
                    className="coding-editor"
                    value={solutions[index]}
                    onChange={(e) =>
                      handleSolutionChange(index, e.target.value)
                    }
                    placeholder={t("Write your solution here...")}
                    rows={10}
                  />
                </div>

                <button
                  className="coding-btn coding-btn-primary coding-mt-4"
                  onClick={() => submitSolution(index)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="coding-spinner"></span>
                  ) : (
                    t("Submit Solution")
                  )}
                </button>

                {feedback[index] && (
                  <div className="coding-feedback-card coding-mt-4">
                    <div className="coding-feedback-score">
                      {t("Score")}: {feedback[index].score}/10
                    </div>
                    <div className="coding-feedback-text coding-whitespace-pre-wrap">
                      {feedback[index].feedback}
                    </div>
                    <div className="coding-mt-4">
                      <h4 className="coding-font-semibold">
                        {t("Expected Solution")}
                      </h4>
                      <pre className="coding-editor coding-mt-2">
                        {feedback[index].expectedSolution}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
