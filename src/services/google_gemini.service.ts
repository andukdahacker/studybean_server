import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { Static, Type } from "@sinclair/typebox";
import { DurationUnitSchema } from "../routes/v1/roadmaps/dto/duration_unit.enum";

export const GeneratedRecommendationSchema = Type.Object({
  title: Type.String(),
  description: Type.String(),
  url: Type.String(),
});

export type GeneratedRecommendation = Static<
  typeof GeneratedRecommendationSchema
>;

export const GeneratedActionSchema = Type.Object({
  name: Type.String(),
  description: Type.String(),
  duration: Type.Number(),
  durationUnit: DurationUnitSchema,
  resource: Type.Array(GeneratedRecommendationSchema),
});

export type GeneratedAction = Static<typeof GeneratedActionSchema>;

export const GenerateMilestonesInputSchema = Type.Object({
  subjectName: Type.String(),
  duration: Type.Number(),
  durationUnit: DurationUnitSchema,
  goal: Type.String(),
});

export type GenerateMilestonesInput = Static<
  typeof GenerateMilestonesInputSchema
>;

export const GenerateMilestonesResponseSchema = Type.Object({
  milestones: Type.Array(
    Type.Object({
      index: Type.Number(),
      name: Type.String(),
      actions: Type.Array(GeneratedActionSchema),
    })
  ),
});

export type GenerateMilestonesResponse = Static<
  typeof GenerateMilestonesResponseSchema
>;

class GoogleGeminiService {
  private model: GenerativeModel;

  constructor(key: string) {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    this.model = model;
  }

  async generateRoadmap(input: GenerateMilestonesInput) {
    const jsonFormat: GenerateMilestonesResponse = {
      milestones: [
        {
          index: 1,
          name: "Milestone 1",
          actions: [
            {
              name: "Action 1",
              description: "Action 1 description",
              duration: 2,
              durationUnit: "WEEK",
              resource: [
                {
                  title: "Recommendation 1",
                  description: "Recommendation 1 description",
                  url: "https://example.com/recommendation-1",
                },
                {
                  title: "Recommendation 2",
                  description: "Recommendation 2 description",
                  url: "https://example.com/recommendation-2",
                },
              ],
            },
            {
              name: "Action 2",
              description: "Action 2 description",
              duration: 3,
              durationUnit: "DAY",
              resource: [
                {
                  title: "Recommendation 3",
                  description: "Recommendation 3 description",
                  url: "https://example.com/recommendation-3",
                },
                {
                  title: "Recommendation 4",
                  description: "Recommendation 4 description",
                  url: "https://example.com/recommendation-4",
                },
              ],
            },
          ],
        },
      ],
    };

    const prompt = `Generate a roadmap for ${
      input.subjectName
    }  in JSON format. Each milestone should have a name and a list of actions. Each actions should have recommendations for learning resources. The learner want to achieve the goal: ${
      input.goal
    }. The learner want to finish this roadmap within ${input.duration} ${
      input.durationUnit
    }. The duration unit should be one of "DAY", "WEEK", "MONTH", "YEAR".   JSON Format should be as follow: ${JSON.stringify(
      jsonFormat
    )}`;

    const result = await this.model.generateContent(prompt);
    return result;
  }
}

export default GoogleGeminiService;
