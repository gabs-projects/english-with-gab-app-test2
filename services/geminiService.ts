
import { GoogleGenAI, Type } from "@google/genai";
import { Question, Submission } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const correctActivity = async (
  activityTitle: string,
  questions: Question[],
  studentAnswers: Record<string, string>
): Promise<{ score: number; feedback: string; detailedResults: any[] }> => {
  const prompt = `
    You are an expert English Teacher for "English With Gab".
    Please correct the following student responses for the activity "${activityTitle}".

    Questions and Student Answers:
    ${questions.map(q => `
      - Question: ${q.prompt}
      - Expected Answer: ${q.correctAnswer}
      - Student Answer: ${studentAnswers[q.id] || '(No answer provided)'}
    `).join('\n')}

    Provide:
    1. A total score from 0 to 100.
    2. A general feedback message in Portuguese encouraging the student.
    3. For each question, indicate if it is correct, and provide a short explanation (feedback) in Portuguese.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING },
            detailedResults: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  questionId: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  feedback: { type: Type.STRING }
                },
                required: ["questionId", "isCorrect", "feedback"]
              }
            }
          },
          required: ["score", "feedback", "detailedResults"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Map the IDs back
    const mappedDetailedResults = result.detailedResults.map((item: any, index: number) => ({
      ...item,
      questionId: questions[index]?.id,
      studentAnswer: studentAnswers[questions[index]?.id] || ''
    }));

    return {
      score: result.score,
      feedback: result.feedback,
      detailedResults: mappedDetailedResults
    };
  } catch (error) {
    console.error("Error correcting activity:", error);
    // Fallback basic logic if API fails
    let correctCount = 0;
    const fallbackDetails = questions.map(q => {
      const isCorrect = studentAnswers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        isCorrect,
        studentAnswer: studentAnswers[q.id],
        feedback: isCorrect ? "Muito bem!" : "Tente novamente na próxima."
      };
    });

    return {
      score: Math.round((correctCount / questions.length) * 100),
      feedback: "Correção automática processada (Modo Offline).",
      detailedResults: fallbackDetails
    };
  }
};
