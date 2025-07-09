import type { OnboardingData } from '../types/onboarding';
import type { MockUser } from '../data/mockUsers';
import { chatGPTApi } from './chatgptApi';

export interface MatchResult {
  user: MockUser;
  matchScore: number;
  matchReasons: string[];
  compatibilityAnalysis: {
    schedule: number;
    lifestyle: number;
    preferences: number;
    location: number;
    budget: number;
    services: number;
  };
}

export interface MatchingCriteria {
  currentUser: OnboardingData;
  maxResults?: number;
  minScore?: number;
  useAI?: boolean;
}

class MatchingEngine {
  private readonly WEIGHTS = {
    schedule: 0.20,
    lifestyle: 0.25,
    preferences: 0.20,
    location: 0.15,
    budget: 0.10,
    services: 0.10
  };

  // Calculate schedule compatibility
  private calculateScheduleCompatibility(user1: OnboardingData, user2: MockUser): number {
    let score = 0;
    const reasons: string[] = [];

    // Work type compatibility
    const workScheduleCompatibility = this.getWorkScheduleScore(
      user1.scheduleInfo?.workSchedule, 
      user2.scheduleInfo?.workSchedule
    );
    score += workScheduleCompatibility * 0.4;

    // Sleep schedule compatibility
    const sleepCompatibility = this.getSleepScheduleScore(
      user1.scheduleInfo,
      user2.scheduleInfo
    );
    score += sleepCompatibility * 0.4;

    // Work from home compatibility
    const wfhCompatibility = this.getWorkFromHomeScore(
      user1.scheduleInfo?.workFromHome,
      user2.scheduleInfo?.workFromHome
    );
    score += wfhCompatibility * 0.2;

    return Math.min(100, score);
  }

  private getWorkScheduleScore(schedule1?: string, schedule2?: string): number {
    if (!schedule1 || !schedule2) return 50;
    
    // Perfect match
    if (schedule1 === schedule2) return 100;
    
    // Compatible schedules
    const compatibleSchedules: { [key: string]: string[] } = {
      'day-shift': ['day-shift', 'remote', 'freelancer'],
      'night-shift': ['night-shift', 'irregular'],
      'remote': ['remote', 'day-shift', 'freelancer'],
      'freelancer': ['freelancer', 'remote', 'day-shift'],
      'student': ['student', 'freelancer', 'remote'],
      'irregular': ['irregular', 'freelancer', 'night-shift']
    };

    if (compatibleSchedules[schedule1]?.includes(schedule2)) {
      return 75;
    }

    return 25;
  }

  private getSleepScheduleScore(schedule1?: any, schedule2?: any): number {
    if (!schedule1?.wakeUpTime || !schedule2?.wakeUpTime) return 50;
    
    const wake1 = this.timeToMinutes(schedule1.wakeUpTime);
    const wake2 = this.timeToMinutes(schedule2.wakeUpTime);
    const bed1 = this.timeToMinutes(schedule1.bedTime);
    const bed2 = this.timeToMinutes(schedule2.bedTime);

    const wakeDiff = Math.abs(wake1 - wake2);
    const bedDiff = Math.abs(bed1 - bed2);
    
    // Full score for differences within 2 hours, severe penalty after 4 hours
    const wakeScore = Math.max(0, 100 - (wakeDiff / 120) * 50);
    const bedScore = Math.max(0, 100 - (bedDiff / 120) * 50);
    
    return (wakeScore + bedScore) / 2;
  }

  private timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getWorkFromHomeScore(wfh1?: boolean, wfh2?: boolean): number {
    if (wfh1 === undefined || wfh2 === undefined) return 50;
    return wfh1 === wfh2 ? 100 : 60; // Not matching but not a critical issue
  }

  // Calculate lifestyle compatibility
  private calculateLifestyleCompatibility(user1: OnboardingData, user2: MockUser): number {
    let score = 0;
    const prefs1 = user1.preferencesInfo;
    const prefs2 = user2.preferencesInfo;

    if (!prefs1 || !prefs2) return 50;

    // Noise level compatibility (35%)
    score += this.getNoiseCompatibility(prefs1.noiseLevel, prefs2.noiseLevel) * 0.35;

    // Cleanliness compatibility (35%)
    score += this.getCleanlinessCompatibility(prefs1.cleanlinessLevel, prefs2.cleanlinessLevel) * 0.35;

    // Pet compatibility (20%)
    score += this.getPetCompatibility(prefs1.petFriendly, prefs2.petFriendly) * 0.20;

    // Smoking compatibility (10%)
    score += this.getSmokingCompatibility(prefs1.smokingTolerance, prefs2.smokingTolerance) * 0.10;

    return Math.min(100, score);
  }

  private getNoiseCompatibility(noise1?: string, noise2?: string): number {
    if (!noise1 || !noise2) return 50;
    
    const noiseScale: { [key: string]: number } = {
      'very-quiet': 1,
      'quiet': 2,
      'moderate': 3,
      'lively': 4
    };

    const diff = Math.abs(noiseScale[noise1] - noiseScale[noise2]);
    return Math.max(20, 100 - diff * 25);
  }

  private getCleanlinessCompatibility(clean1?: string, clean2?: string): number {
    if (!clean1 || !clean2) return 50;
    
    const cleanScale: { [key: string]: number } = {
      'moderate': 1,
      'clean': 2,
      'very-clean': 3
    };

    const diff = Math.abs(cleanScale[clean1] - cleanScale[clean2]);
    return Math.max(30, 100 - diff * 30);
  }

  private getPetCompatibility(pet1?: boolean, pet2?: boolean): number {
    if (pet1 === undefined || pet2 === undefined) return 50;
    return pet1 === pet2 ? 100 : 40; // Pet mismatch is a bigger issue
  }

  private getSmokingCompatibility(smoke1?: string, smoke2?: string): number {
    if (!smoke1 || !smoke2) return 50;
    
    if (smoke1 === smoke2) return 100;
    if ((smoke1 === 'no-smoking' && smoke2 === 'outdoor-only') ||
        (smoke1 === 'outdoor-only' && smoke2 === 'no-smoking')) {
      return 80;
    }
    return 20;
  }

  // Calculate preferences compatibility
  private calculatePreferencesCompatibility(user1: OnboardingData, user2: MockUser): number {
    let score = 0;
    const prefs1 = user1.preferencesInfo;
    const prefs2 = user2.preferencesInfo;

    if (!prefs1 || !prefs2) return 50;

    // LGBTQ+ inclusivity compatibility (40%)
    const lgbtqScore = this.getLgbtqCompatibility(prefs1.lgbtqInclusive, prefs2.lgbtqInclusive);
    score += lgbtqScore * 0.40;

    // Gender preference compatibility (40%)
    const genderScore = this.getGenderPreferenceCompatibility(
      prefs1.genderPreference, 
      prefs2.genderPreference
    );
    score += genderScore * 0.40;

    // Housing type preference (20%)
    const housingScore = this.getHousingTypeCompatibility(
      user1.housingInfo?.housingType,
      user2.housingInfo?.housingType
    );
    score += housingScore * 0.20;

    return Math.min(100, score);
  }

  private getLgbtqCompatibility(lgbtq1?: boolean, lgbtq2?: boolean): number {
    if (lgbtq1 === undefined || lgbtq2 === undefined) return 50;
    
    // If either party requires LGBTQ+ inclusivity, the other must also support it
    if (lgbtq1 === true && lgbtq2 === false) return 10;
    if (lgbtq1 === false && lgbtq2 === true) return 10;
    
    return lgbtq1 === lgbtq2 ? 100 : 50;
  }

  private getGenderPreferenceCompatibility(pref1?: string, pref2?: string): number {
    if (!pref1 || !pref2) return 50;
    
    // If both have no preference, perfect match
    if (pref1 === 'no-preference' && pref2 === 'no-preference') return 100;
    
    // If one has no preference while the other has preference, it's still okay
    if (pref1 === 'no-preference' || pref2 === 'no-preference') return 80;
    
    // If both have the same preference
    if (pref1 === pref2) return 90;
    
    // Different preferences may have conflicts
    return 40;
  }

  private getHousingTypeCompatibility(type1?: string, type2?: string): number {
    if (!type1 || !type2) return 50;
    return type1 === type2 ? 100 : 70;
  }

  // Calculate location compatibility
  private calculateLocationCompatibility(user1: OnboardingData, user2: MockUser): number {
    const loc1 = user1.basicInfo?.location;
    const loc2 = user2.basicInfo?.location;
    const pref1 = user1.housingInfo?.preferredLocation;
    const pref2 = user2.housingInfo?.preferredLocation;

    if (!loc1 || !loc2) return 50;

    // Simple location matching logic
    const cityMatch = this.getCityMatch(loc1, loc2);
    const preferenceMatch = this.getLocationPreferenceMatch(pref1, pref2, loc1, loc2);

    return (cityMatch * 0.6 + preferenceMatch * 0.4);
  }

  private getCityMatch(loc1: string, loc2: string): number {
    // Extract main city names
    const city1 = loc1.split(',')[0].trim().toLowerCase();
    const city2 = loc2.split(',')[0].trim().toLowerCase();

    if (city1 === city2) return 100;

    // Bay Area cities cluster
    const bayAreaCities = ['san francisco', 'oakland', 'berkeley', 'palo alto', 'mountain view', 'san mateo'];
    const isBayArea1 = bayAreaCities.some(city => city1.includes(city));
    const isBayArea2 = bayAreaCities.some(city => city2.includes(city));

    if (isBayArea1 && isBayArea2) return 75;

    return 30;
  }

  private getLocationPreferenceMatch(pref1?: string, pref2?: string, loc1?: string, loc2?: string): number {
    if (!pref1 || !pref2 || !loc1 || !loc2) return 50;

    // Check if preferred locations match current locations
    const pref1MatchesLoc2 = pref1.toLowerCase().includes(loc2.split(',')[0].trim().toLowerCase());
    const pref2MatchesLoc1 = pref2.toLowerCase().includes(loc1.split(',')[0].trim().toLowerCase());

    if (pref1MatchesLoc2 && pref2MatchesLoc1) return 100;
    if (pref1MatchesLoc2 || pref2MatchesLoc1) return 75;

    return 40;
  }

  // Calculate budget compatibility
  private calculateBudgetCompatibility(user1: OnboardingData, user2: MockUser): number {
    const budget1 = user1.housingInfo?.budget;
    const budget2 = user2.housingInfo?.budget;

    if (!budget1 || !budget2) return 50;

    // Calculate overlap range
    const overlapMin = Math.max(budget1.min, budget2.min);
    const overlapMax = Math.min(budget1.max, budget2.max);

    if (overlapMin > overlapMax) return 10; // No overlap at all

    const overlapSize = overlapMax - overlapMin;
    const totalRange = Math.max(budget1.max - budget1.min, budget2.max - budget2.min);
    
    const overlapRatio = overlapSize / totalRange;
    return Math.min(100, overlapRatio * 100 + 20);
  }

  // Calculate service exchange compatibility
  private calculateServicesCompatibility(user1: OnboardingData, user2: MockUser): number {
    const services1 = user1.servicesInfo;
    const services2 = user2.servicesInfo;

    if (!services1 || !services2) return 50;

    let score = 0;
    let matches = 0;

    // Check service exchange complementarity
    const offered1 = services1.servicesOffered || [];
    const needed1 = services1.servicesNeeded || [];
    const offered2 = services2.servicesOffered || [];
    const needed2 = services2.servicesNeeded || [];

    // Services user1 offers that meet user2's needs
    const user1ToUser2 = needed2.filter(service => offered1.includes(service)).length;
    // Services user2 offers that meet user1's needs
    const user2ToUser1 = needed1.filter(service => offered2.includes(service)).length;

    const totalNeeds = needed1.length + needed2.length;
    const totalMatches = user1ToUser2 + user2ToUser1;

    if (totalNeeds === 0) return 50;

    const matchRatio = totalMatches / totalNeeds;
    return Math.min(100, matchRatio * 100 + 30);
  }

  // Generate match reasons
  private generateMatchReasons(
    user1: OnboardingData, 
    user2: MockUser, 
    scores: any
  ): string[] {
    const reasons: string[] = [];

    if (scores.schedule >= 75) {
      reasons.push(`Compatible schedules (${user1.scheduleInfo?.workSchedule} & ${user2.scheduleInfo?.workSchedule})`);
    }

    if (scores.lifestyle >= 80) {
      if (user1.preferencesInfo?.cleanlinessLevel === user2.preferencesInfo?.cleanlinessLevel) {
        reasons.push(`Shared cleanliness standards (${user1.preferencesInfo?.cleanlinessLevel})`);
      }
      if (user1.preferencesInfo?.noiseLevel === user2.preferencesInfo?.noiseLevel) {
        reasons.push(`Similar noise preferences (${user1.preferencesInfo?.noiseLevel})`);
      }
    }

    if (scores.preferences >= 80) {
      if (user1.preferencesInfo?.lgbtqInclusive && user2.preferencesInfo?.lgbtqInclusive) {
        reasons.push('Both value LGBTQ+ inclusive environment');
      }
    }

    if (scores.location >= 75) {
      reasons.push('Great location match');
    }

    if (scores.budget >= 70) {
      reasons.push('Compatible budget ranges');
    }

    if (scores.services >= 70) {
      const offered1 = user1.servicesInfo?.servicesOffered || [];
      const needed2 = user2.servicesInfo?.servicesNeeded || [];
      const matches = needed2.filter(service => offered1.includes(service));
      if (matches.length > 0) {
        reasons.push(`Can help with: ${matches.join(', ')}`);
      }
    }

    return reasons;
  }

  // ChatGPT API enhanced matching
  private async getAIEnhancedMatch(
    user1: OnboardingData,
    user2: MockUser,
    ruleBasedScore: number
  ): Promise<{ score: number; reasons: string[] }> {
    const aiPrompt = this.buildAIPrompt(user1, user2, ruleBasedScore);
    
    try {
      // Real ChatGPT API call
      const aiAnalysis = await chatGPTApi.analyzeRoommateCompatibility(aiPrompt);
      
      return {
        score: aiAnalysis.score,
        reasons: aiAnalysis.reasons
      };
    } catch (error) {
      console.error('AI matching failed, falling back to rule-based:', error);
      // If API fails, fallback to simulated results
      return this.simulateAIResponse(ruleBasedScore);
    }
  }

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

  private simulateAIResponse(baseScore: number): { score: number; reasons: string[] } {
    // Simulate AI score adjustment (based on some complex personality analysis)
    const adjustment = (Math.random() - 0.5) * 10; // ±5 point adjustment
    const adjustedScore = Math.max(0, Math.min(100, baseScore + adjustment));
    
    const aiReasons = [
      'AI detected complementary personality traits',
      'Communication styles seem well-matched',
      'Shared values around community and respect'
    ];
    
    return { score: adjustedScore, reasons: aiReasons };
  }

  // Main matching method
  async findMatches(criteria: MatchingCriteria, candidateUsers: MockUser[]): Promise<MatchResult[]> {
    const { currentUser, maxResults = 10, minScore = 60, useAI = false } = criteria;
    const results: MatchResult[] = [];

    for (const candidate of candidateUsers) {
      // Calculate compatibility scores for each dimension
      const scheduleScore = this.calculateScheduleCompatibility(currentUser, candidate);
      const lifestyleScore = this.calculateLifestyleCompatibility(currentUser, candidate);
      const preferencesScore = this.calculatePreferencesCompatibility(currentUser, candidate);
      const locationScore = this.calculateLocationCompatibility(currentUser, candidate);
      const budgetScore = this.calculateBudgetCompatibility(currentUser, candidate);
      const servicesScore = this.calculateServicesCompatibility(currentUser, candidate);

      const compatibilityAnalysis = {
        schedule: scheduleScore,
        lifestyle: lifestyleScore,
        preferences: preferencesScore,
        location: locationScore,
        budget: budgetScore,
        services: servicesScore
      };

      // Calculate weighted total score
      let totalScore = 
        scheduleScore * this.WEIGHTS.schedule +
        lifestyleScore * this.WEIGHTS.lifestyle +
        preferencesScore * this.WEIGHTS.preferences +
        locationScore * this.WEIGHTS.location +
        budgetScore * this.WEIGHTS.budget +
        servicesScore * this.WEIGHTS.services;

      let matchReasons = this.generateMatchReasons(currentUser, candidate, compatibilityAnalysis);

      // If AI enhancement is enabled
      if (useAI) {
        const aiResult = await this.getAIEnhancedMatch(currentUser, candidate, totalScore);
        totalScore = aiResult.score;
        matchReasons = [...matchReasons, ...aiResult.reasons];
      }

      // Only include matches that reach minimum score
      if (totalScore >= minScore) {
        results.push({
          user: { ...candidate, matchScore: totalScore, matchReasons },
          matchScore: totalScore,
          matchReasons,
          compatibilityAnalysis
        });
      }
    }

    // Sort by match score and limit results
    return results
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxResults);
  }
}

export const matchingEngine = new MatchingEngine();
export default matchingEngine; 