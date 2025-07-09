// ChatGPT API 服务配置
// 请在 .env 文件中添加你的 OpenAI API 密钥：
// VITE_OPENAI_API_KEY=你的API密钥

interface ChatGPTResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface MatchingAnalysis {
  score: number;
  reasons: string[];
  concerns?: string[];
}

class ChatGPTApiService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor() {
    // Get API key from environment variables
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('ChatGPT API key not found. AI-enhanced matching will use fallback.');
    }
  }

  // Main ChatGPT API call method
  async analyzeRoommateCompatibility(prompt: string): Promise<MatchingAnalysis> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4', // 或者使用 'gpt-3.5-turbo' 节省成本
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt()
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: ChatGPTResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response content from ChatGPT');
      }

      return this.parseResponse(content);
    } catch (error) {
      console.error('ChatGPT API error:', error);
      throw error;
    }
  }

  // System prompt - Define ChatGPT's role and task
  private getSystemPrompt(): string {
    return `You are a professional roommate compatibility AI analyst, specializing in analyzing the compatibility between two people as potential roommates.

Your tasks are:
1. Analyze compatibility between two users based on provided data
2. Consider psychological, sociological, and behavioral factors
3. Identify potential conflict points and synergies
4. Provide accurate compatibility score (0-100)
5. Give specific matching reasons

Analysis dimensions include but are not limited to:
- Coordination of daily routines and work schedules
- Complementary and conflicting personality traits
- Consistency in values and life philosophies
- Communication styles and social preferences
- Living habits and personal space needs
- Financial situations and spending attitudes
- Long-term goals and life planning

Always respond in JSON format with the following fields:
{
  "score": compatibility_score (0-100),
  "reasons": ["reason1", "reason2", "reason3"],
  "concerns": ["concern1", "concern2"] (optional)
}

Requirements:
- Scores should be objective and accurate, considering all factors
- Reasons should be specific and clear, avoid generalities
- If major incompatibility factors are found, mention them in concerns
- Respond in English while maintaining professionalism`;
  }

  // Parse ChatGPT response
  private parseResponse(content: string): MatchingAnalysis {
    try {
      // Try to extract JSON part
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate response format
      if (typeof parsed.score !== 'number' || !Array.isArray(parsed.reasons)) {
        throw new Error('Invalid response format');
      }

      return {
        score: Math.max(0, Math.min(100, parsed.score)), // Ensure score is within 0-100 range
        reasons: parsed.reasons.slice(0, 5), // Take at most 5 reasons
        concerns: parsed.concerns || []
      };
    } catch (error) {
      console.error('Error parsing ChatGPT response:', error);
      // If parsing fails, return default values
      return {
        score: 70,
        reasons: ['AI analysis temporarily unavailable, using basic matching algorithm'],
        concerns: []
      };
    }
  }

  // Check if API is available
  async testConnection(): Promise<boolean> {
    if (!this.apiKey) return false;

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('ChatGPT API connection test failed:', error);
      return false;
    }
  }
}

export const chatGPTApi = new ChatGPTApiService();
export default chatGPTApi; 