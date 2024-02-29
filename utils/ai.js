import { z } from "zod";
import { OpenAI } from "@langchain/openai";
// import { GooglePaLM } from "langchain/llms/googlepalm";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";

// For Creating Diet Plan

const parserForDietPlan = StructuredOutputParser.fromZodSchema(
  z.object({
    morning: z.string().describe("Morning meal suggestion."),
    midMorningSnacks: z.string().describe("Mid Morning Snacks suggestion."),
    lunch: z.string().describe("Lunch suggestion."),
    eveningSnacks: z.string().describe("Evening Snacks suggestion."),
    dinner: z.string().describe("Dinner suggestion."),
    dietPreference: z
      .string()
      .describe(
        "Diet preference of the user. (Either Vegetarian or Non-Vegetarian)"
      ),
  })
);

const getPromptForDietPlan = async (content) => {
  const format_instructions = parserForDietPlan.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Create a diet plan based on the given data for this user. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({ entry: content });
  return input;
};

export const createDietPlan = async (content) => {
  const input = await getPromptForDietPlan(content);

  const model = new ChatGoogleGenerativeAI({
    temperature: 0,
    modelName: "gemini-pro",
    apiKey: process.env.GEMINI_KEY,
  });
  const output = await model.invoke(input);
  return output;
};

// For Analyzing Food

const parserForAnalyze = StructuredOutputParser.fromZodSchema(
  z.object({
    calorie: z
      .number()
      .describe(
        "the average calorie count (in number) of the given food item."
      ),
    foodEaten: z.string().describe("the food item eaten by the user."),
    negative: z
      .boolean()
      .describe(
        "is the food eaten unhealthy or healthy? (i.e. does it contain junk food?)."
      ),
  })
);
const getPromptForAnalyze = async (content) => {
  const format_instructions = parserForAnalyze.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Analyze the given food. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({ entry: content });
  return input;
};
export const analyzeGivenFood = async (content) => {
  const input = await getPromptForAnalyze(content);

  const model = new ChatGoogleGenerativeAI({
    temperature: 0,
    modelName: "gemini-pro",
    apiKey: process.env.GEMINI_KEY,
  });
  const output = await model.invoke(input);
  return output;
  // console.log({ output });

  //   try {
  //     return parser.parse(output);
  //   } catch (e) {
  //     const fixParser = OutputFixingParser.fromLLM(
  //       new ChatGoogleGenerativeAI({ temperature: 0, modelName: "gemini-pro" }),
  //       parser
  //     );
  //     const fix = await fixParser.parse(output);
  //     return fix;
  //   }
};

// For Making another plan if ate bad food

const parserForBadFood = StructuredOutputParser.fromZodSchema(
  z.object({
    morning: z.string().describe("Morning meal suggestion."),
    midMorningSnacks: z.string().describe("Mid Morning Snacks suggestion."),
    lunch: z.string().describe("Lunch suggestion."),
    eveningSnacks: z.string().describe("Evening Snacks suggestion."),
    dinner: z.string().describe("Dinner suggestion."),
    suggestion: z.string().describe("Suggestion for the user."),
  })
);

const getPromptForBadFood = async (content) => {
  const format_instructions = parserForBadFood.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      "Create a diet plan based on the given data for this user and What they previously ate, What their current diet plan is and what their diet preference is. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}",
    inputVariables: ["entry"],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({ entry: content });
  return input;
};

export const createDietPlanForBadFood = async (content) => {
  const input = await getPromptForBadFood(content);

  const model = new ChatGoogleGenerativeAI({
    temperature: 0,
    modelName: "gemini-pro",
    apiKey: process.env.GEMINI_KEY,
  });
  const output = await model.invoke(input);
  return output;
};
