# ChatGPT API Integration Guide

## 📍 API Integration Locations

### 1. **Main Service File**
- **File Location**: `src/services/chatgptApi.ts`
- **Function**: Core ChatGPT API service class
- **Includes**: API calls, response parsing, error handling

### 2. **Matching Engine Integration**
- **File Location**: `src/services/matchingEngine.ts`
- **Method**: `getAIEnhancedMatch()` (lines 375-390)
- **Call Location**: AI enhancement logic in `findMatches()` method

## 🔑 API Key Configuration

### Step 1: Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Log in and create a new API key
3. Copy the generated key (format: `sk-xxxxxxxxxxxxxxxxxxxxxxxxx`)

### Step 2: Configure Environment Variables
1. Copy `env.example` to `.env`
2. Add your API key:
```bash
VITE_OPENAI_API_KEY=sk-your-actual-api-key
```
3. Restart the development server

## 💬 Prompt Configuration

### System Prompt Location
**File**: `src/services/chatgptApi.ts`
**Method**: `getSystemPrompt()` (lines 72-104)

```typescript
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
```

### User Data Prompt Location
**File**: `src/services/matchingEngine.ts`
**Method**: `buildAIPrompt()` (lines 392-412)

```typescript
private buildAIPrompt(user1: OnboardingData, user2: MockUser, baseScore: number): string {
  return `
Analyze roommate compatibility between these two users:

User 1:
- Schedule: ${user1.scheduleInfo?.workSchedule}, ${user1.scheduleInfo?.wakeUpTime}-${user1.scheduleInfo?.bedTime}
- Preferences: ${JSON.stringify(user1.preferencesInfo)}
- Services: Offers ${user1.servicesInfo?.servicesOffered?.join(', ')}, Needs ${user1.servicesInfo?.servicesNeeded?.join(', ')}
- Housing: ${user1.housingInfo?.housingType}, Budget $${user1.housingInfo?.budget?.min}-${user1.housingInfo?.budget?.max}

User 2:
- Bio: ${user2.bio}
- Schedule: ${user2.scheduleInfo?.workSchedule}, ${user2.scheduleInfo?.wakeUpTime}-${user2.scheduleInfo?.bedTime}
- Preferences: ${JSON.stringify(user2.preferencesInfo)}
- Services: Offers ${user2.servicesInfo?.servicesOffered?.join(', ')}, Needs ${user2.servicesInfo?.servicesNeeded?.join(', ')}

Rule-based compatibility score: ${baseScore}/100

Please provide:
1. Adjusted compatibility score (0-100)
2. Top 3 compatibility reasons
3. Potential concerns or red flags

Respond in JSON format: {"score": number, "reasons": string[], "concerns": string[]}
  `;
}
```

## 🔧 Custom Configuration Options

### 1. Modify GPT Model
In `chatgptApi.ts` line 44:
```typescript
model: 'gpt-4', // Change to 'gpt-3.5-turbo' to save costs
```

### 2. Adjust Response Length
In `chatgptApi.ts` line 52:
```typescript
max_tokens: 500, // Increase or decrease token limit
```

### 3. Adjust Creativity
In `chatgptApi.ts` line 53:
```typescript
temperature: 0.7, // 0.1-1.0, higher = more creative
```

## 🚀 Usage Methods

### 1. User Interface Activation
On the matches page (`/matches`), there's an "AI Enhanced Matching" toggle in the top right

### 2. Programmatic Call
```typescript
const matchResults = await matchingEngine.findMatches({
  currentUser: onboardingData,
  maxResults: 10,
  minScore: 60,
  useAI: true // Enable AI enhancement
}, candidateUsers);
```

## 📊 API Response Format

### Expected ChatGPT Response:
```json
{
  "score": 85,
  "reasons": [
    "Both have highly compatible schedules, both are early risers",
    "Both value clean and quiet living environments",
    "Great complementarity in service exchange"
  ],
  "concerns": [
    "Budget differences may require further negotiation"
  ]
}
```

## ⚠️ Error Handling

### Automatic Fallback Mechanism
If ChatGPT API fails, the system automatically falls back to rule-based matching algorithm, ensuring user experience is not affected.

### Error Log Locations
- Browser Console: View API call errors
- Network Panel: Check HTTP request status

## 💰 Cost Control

### Estimated Costs (Based on OpenAI Pricing)
- **gpt-3.5-turbo**: ~$0.002 per 1K tokens
- **gpt-4**: ~$0.03 per 1K tokens
- **Per Match**: ~500 tokens
- **10 Matches Cost**: gpt-3.5 (~$0.01) | gpt-4 (~$0.15)

### Cost Saving Suggestions
1. Use `gpt-3.5-turbo` instead of `gpt-4`
2. Reduce `max_tokens` limit
3. Add user quota limits
4. Cache similar match results

## 🧪 Test API Connection

### Testing Method
```typescript
// Test in browser console
import { chatGPTApi } from './src/services/chatgptApi';
const isConnected = await chatGPTApi.testConnection();
console.log('API Connection Status:', isConnected);
```

## 🔄 Upgrades and Maintenance

### Version Compatibility
- Current Support: OpenAI API v1
- Recommend regular checks for OpenAI documentation updates

### Monitoring Suggestions
- Monitor API response times
- Track error rates and success rates
- Analyze user feedback to improve prompts

---

## 📞 Need Help?

If you encounter integration issues, please check:
1. ✅ Is the API key correctly configured?
2. ✅ Is the network connection normal?
3. ✅ Does the OpenAI account have sufficient balance?
4. ✅ Are there any error messages in the browser console? 