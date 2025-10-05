'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized product recommendations
 * based on user purchase history.
 *
 * - getPersonalizedRecommendations - A function that retrieves personalized product recommendations for a user.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  userId: z.string().describe('The ID of the user for whom to generate recommendations.'),
  purchaseHistory: z.array(z.string()).describe('An array of product IDs representing the user\'s purchase history.'),
  browsingHistory: z.array(z.string()).describe('An array of product IDs representing the user\'s browsing history.'),
});
export type PersonalizedRecommendationsInput = z.infer<typeof PersonalizedRecommendationsInputSchema>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendedProductIds: z.array(z.string()).describe('An array of product IDs recommended for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert recommendation system for a thrift store.

  Based on the user's purchase history and browsing history, recommend products that the user might be interested in.
  Return a list of product IDs.

  User ID: {{{userId}}}
  Purchase History: {{#if purchaseHistory}}{{{purchaseHistory}}}{{else}}No purchase history{{/if}}
  Browsing History: {{#if browsingHistory}}{{{browsingHistory}}}{{else}}No browsing history{{/if}}

  Recommended Product IDs:`,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
