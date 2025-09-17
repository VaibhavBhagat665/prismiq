// Job API Integration Service
// This service handles integration with LinkedIn, Naukri, and Internshala APIs

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  skills: string[];
  description: string;
  postedDate: string;
  platform: 'linkedin' | 'naukri' | 'internshala';
  matchScore: number;
  applicationUrl: string;
  companyLogo?: string;
}

export interface JobSearchParams {
  query?: string;
  location?: string;
  experience?: string;
  jobType?: string;
  platform?: string;
  limit?: number;
}

class JobApiService {
  private readonly baseUrls = {
    linkedin: 'https://api.linkedin.com/v2',
    naukri: 'https://www.naukri.com/jobapi',
    internshala: 'https://internshala.com/api'
  };

  private readonly apiKeys = {
    linkedin: process.env.REACT_APP_LINKEDIN_API_KEY || '',
    naukri: process.env.REACT_APP_NAUKRI_API_KEY || '',
    internshala: process.env.REACT_APP_INTERNSHALA_API_KEY || ''
  };

  // LinkedIn Jobs API Integration
  async fetchLinkedInJobs(params: JobSearchParams): Promise<JobOpportunity[]> {
    try {
      // Note: LinkedIn requires OAuth 2.0 authentication
      // This is a simplified example - actual implementation requires proper auth flow
      
      const queryParams = new URLSearchParams({
        keywords: params.query || '',
        location: params.location || '',
        count: (params.limit || 10).toString()
      });

      const response = await fetch(`${this.baseUrls.linkedin}/jobSearch?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.linkedin}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });

      if (!response.ok) {
        throw new Error(`LinkedIn API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformLinkedInJobs(data.elements || []);
    } catch (error) {
      console.error('LinkedIn API error:', error);
      return this.getMockLinkedInJobs(params);
    }
  }

  // Naukri Jobs API Integration
  async fetchNaukriJobs(params: JobSearchParams): Promise<JobOpportunity[]> {
    try {
      // Naukri API endpoint (hypothetical - actual API may differ)
      const queryParams = new URLSearchParams({
        q: params.query || '',
        l: params.location || '',
        exp: params.experience || '',
        limit: (params.limit || 10).toString()
      });

      const response = await fetch(`${this.baseUrls.naukri}/jobs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.naukri}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Naukri API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformNaukriJobs(data.jobs || []);
    } catch (error) {
      console.error('Naukri API error:', error);
      return this.getMockNaukriJobs(params);
    }
  }

  // Internshala Jobs API Integration
  async fetchInternshalaJobs(params: JobSearchParams): Promise<JobOpportunity[]> {
    try {
      // Internshala API endpoint (hypothetical - actual API may differ)
      const queryParams = new URLSearchParams({
        search: params.query || '',
        location: params.location || '',
        type: params.jobType || '',
        per_page: (params.limit || 10).toString()
      });

      const response = await fetch(`${this.baseUrls.internshala}/internships?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKeys.internshala}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Internshala API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformInternshalaJobs(data.internships || []);
    } catch (error) {
      console.error('Internshala API error:', error);
      return this.getMockInternshalaJobs(params);
    }
  }

  // Aggregate jobs from all platforms
  async searchJobs(params: JobSearchParams): Promise<JobOpportunity[]> {
    const promises = [];

    if (!params.platform || params.platform === 'linkedin') {
      promises.push(this.fetchLinkedInJobs(params));
    }
    if (!params.platform || params.platform === 'naukri') {
      promises.push(this.fetchNaukriJobs(params));
    }
    if (!params.platform || params.platform === 'internshala') {
      promises.push(this.fetchInternshalaJobs(params));
    }

    const results = await Promise.allSettled(promises);
    const allJobs = results
      .filter((result): result is PromiseFulfilledResult<JobOpportunity[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value);

    // Sort by match score (descending)
    return allJobs.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Transform LinkedIn API response to our JobOpportunity interface
  private transformLinkedInJobs(linkedinJobs: any[]): JobOpportunity[] {
    return linkedinJobs.map((job, index) => ({
      id: `linkedin-${job.id || index}`,
      title: job.title || 'Software Engineer',
      company: job.companyName || 'Tech Company',
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      type: job.jobType || 'Full-time',
      experience: job.experienceLevel || '2-5 years',
      skills: job.skills || ['JavaScript', 'React', 'Node.js'],
      description: job.description || 'Exciting opportunity to join our team...',
      postedDate: this.formatDate(job.postedAt) || '1 day ago',
      platform: 'linkedin' as const,
      matchScore: this.calculateMatchScore(job),
      applicationUrl: job.applyUrl || `https://linkedin.com/jobs/${job.id}`,
      companyLogo: job.companyLogo
    }));
  }

  // Transform Naukri API response to our JobOpportunity interface
  private transformNaukriJobs(naukriJobs: any[]): JobOpportunity[] {
    return naukriJobs.map((job, index) => ({
      id: `naukri-${job.id || index}`,
      title: job.jobTitle || 'Frontend Developer',
      company: job.companyName || 'Startup Inc',
      location: job.jobLocation || 'Mumbai, India',
      salary: job.packageOffered || '₹8-15 LPA',
      type: job.jobType || 'Full-time',
      experience: job.experience || '2-4 years',
      skills: job.keySkills || ['React', 'JavaScript', 'CSS'],
      description: job.jobDescription || 'Join our dynamic team...',
      postedDate: this.formatDate(job.createdDate) || '2 days ago',
      platform: 'naukri' as const,
      matchScore: this.calculateMatchScore(job),
      applicationUrl: job.jdURL || `https://naukri.com/job/${job.id}`,
      companyLogo: job.logoPath
    }));
  }

  // Transform Internshala API response to our JobOpportunity interface
  private transformInternshalaJobs(internshalaJobs: any[]): JobOpportunity[] {
    return internshalaJobs.map((job, index) => ({
      id: `internshala-${job.id || index}`,
      title: job.title || 'Data Science Intern',
      company: job.company || 'AI Solutions',
      location: job.location || 'Delhi, India',
      salary: job.stipend || '₹20,000/month',
      type: 'Internship',
      experience: '0-1 years',
      skills: job.skills || ['Python', 'Machine Learning', 'SQL'],
      description: job.description || 'Exciting internship opportunity...',
      postedDate: this.formatDate(job.start_date) || '3 days ago',
      platform: 'internshala' as const,
      matchScore: this.calculateMatchScore(job),
      applicationUrl: job.url || `https://internshala.com/internship/${job.id}`,
      companyLogo: job.company_logo
    }));
  }

  // Calculate match score based on job attributes and user profile
  private calculateMatchScore(job: any): number {
    // This is a simplified scoring algorithm
    // In a real implementation, this would use ML models and user profile data
    let score = 70; // Base score

    // Add points for relevant skills
    const userSkills = ['React', 'JavaScript', 'TypeScript', 'Node.js']; // This would come from user profile
    const jobSkills = job.skills || job.keySkills || [];
    const skillMatches = jobSkills.filter((skill: string) => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    score += skillMatches.length * 5;

    // Add randomness to simulate ML scoring
    score += Math.random() * 20 - 10;

    return Math.min(Math.max(Math.round(score), 60), 98);
  }

  // Format date to relative time
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }

  // Mock data for development/fallback
  private getMockLinkedInJobs(params: JobSearchParams): JobOpportunity[] {
    return [
      {
        id: 'linkedin-1',
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'Bangalore, India',
        salary: '₹15-25 LPA',
        type: 'Full-time',
        experience: '3-5 years',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        description: 'We are looking for a senior software engineer to join our growing team...',
        postedDate: '2 days ago',
        platform: 'linkedin',
        matchScore: 92,
        applicationUrl: 'https://linkedin.com/jobs/123',
        companyLogo: '/placeholder.svg'
      }
    ];
  }

  private getMockNaukriJobs(params: JobSearchParams): JobOpportunity[] {
    return [
      {
        id: 'naukri-1',
        title: 'Frontend Developer',
        company: 'StartupXYZ',
        location: 'Mumbai, India',
        salary: '₹8-15 LPA',
        type: 'Full-time',
        experience: '2-4 years',
        skills: ['React', 'JavaScript', 'CSS', 'Redux'],
        description: 'Join our dynamic team as a frontend developer...',
        postedDate: '1 day ago',
        platform: 'naukri',
        matchScore: 88,
        applicationUrl: 'https://naukri.com/job/456'
      }
    ];
  }

  private getMockInternshalaJobs(params: JobSearchParams): JobOpportunity[] {
    return [
      {
        id: 'internshala-1',
        title: 'Data Science Intern',
        company: 'AI Solutions',
        location: 'Delhi, India',
        salary: '₹20,000/month',
        type: 'Internship',
        experience: '0-1 years',
        skills: ['Python', 'Machine Learning', 'SQL', 'Pandas'],
        description: 'Exciting internship opportunity in data science...',
        postedDate: '3 days ago',
        platform: 'internshala',
        matchScore: 85,
        applicationUrl: 'https://internshala.com/internship/789'
      }
    ];
  }
}

// Export singleton instance
export const jobApiService = new JobApiService();
export default jobApiService;
