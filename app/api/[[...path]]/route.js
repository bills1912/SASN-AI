import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import openai, { USE_MOCK_MODE } from '@/lib/openai';
import { authenticateUser, generateMockToken, verifyMockToken } from '@/lib/mockAuth';
import { 
  mockASNProfiles, 
  mockPerformanceData, 
  mockASNNews,
  getASNProfile,
  getPerformanceData,
  getAllASNProfiles,
  getAllPerformanceData
} from '@/lib/mockBKNData';
import {
  getMockTalentMapping,
  getMockSkillAnalysis,
  getMockPerformanceAnalysis
} from '@/lib/mockAIResponses';

// Helper to extract path segments
function getPathSegments(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace('/api/', '');
  return pathname.split('/').filter(Boolean);
}

// Helper for authentication
function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7);
  return verifyMockToken(token);
}

// Auth endpoints
async function handleAuth(segments, request, method) {
  if (segments[0] === 'login' && method === 'POST') {
    const { username, password } = await request.json();
    const user = authenticateUser(username, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    const token = generateMockToken(user);
    return NextResponse.json({ user, token });
  }
  
  if (segments[0] === 'verify' && method === 'GET') {
    const user = verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.json({ user });
  }
  
  return null;
}

// Talent Management endpoints
async function handleTalentManagement(segments, request, method) {
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get all ASN profiles
  if (segments[0] === 'profiles' && method === 'GET') {
    return NextResponse.json({ profiles: getAllASNProfiles() });
  }
  
  // Get single ASN profile
  if (segments[0] === 'profile' && segments[1] && method === 'GET') {
    const nip = segments[1];
    const profile = getASNProfile(nip);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    return NextResponse.json({ profile });
  }
  
  // Analyze talent from document
  if (segments[0] === 'analyze-document' && method === 'POST') {
    try {
      const { content, nip } = await request.json();
      
      const prompt = `Analyze the following ASN (Indonesian Civil Servant) performance document and extract:
1. Technical skills (hard skills) with proficiency levels
2. Soft skills with assessment
3. Key achievements and their significance
4. Training and certifications relevance
5. Overall competency assessment (scale 1-100)
6. Potential for leadership roles (scale 1-100)

Document content:
${content}

Return the analysis in JSON format with these fields:
{
  "technicalSkills": [{"skill": "name", "level": "beginner|intermediate|advanced|expert", "score": 0-100}],
  "softSkills": [{"skill": "name", "assessment": "description", "score": 0-100}],
  "achievements": [{"title": "name", "significance": "description", "impact": 0-100}],
  "competencyScore": 0-100,
  "potentialScore": 0-100,
  "summary": "brief summary",
  "recommendations": ["recommendation1", "recommendation2"]
}`;
      
      const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert HR analyst specializing in Indonesian civil service (ASN) competency assessment and talent management.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(response.choices[0].message.content);
      
      // Save analysis to MongoDB
      const client = await clientPromise;
      const db = client.db('asta_cita_ai');
      await db.collection('talent_analyses').insertOne({
        nip,
        analysis,
        timestamp: new Date()
      });
      
      return NextResponse.json({ analysis });
    } catch (error) {
      console.error('Error analyzing document:', error);
      return NextResponse.json(
        { error: 'Failed to analyze document', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Generate talent mapping (quadrant analysis)
  if (segments[0] === 'talent-mapping' && method === 'POST') {
    try {
      const { nip } = await request.json();
      
      const profile = getASNProfile(nip);
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
      const performanceData = getPerformanceData(nip);
      
      let mapping;
      
      if (USE_MOCK_MODE) {
        // Use mock AI response for demonstration
        mapping = getMockTalentMapping(profile);
      } else {
        // Use actual OpenAI API
        const prompt = `Based on this ASN profile, perform a comprehensive talent mapping analysis:

Profile:
- Name: ${profile.name}
- Position: ${profile.position}
- Agency: ${profile.agency}
- Years of Service: ${profile.yearsOfService}
- Education: ${profile.education}
- Performance Score: ${profile.performanceScore}
- Skills: ${JSON.stringify(profile.skills)}
- Achievements: ${JSON.stringify(profile.achievements)}
- Projects: ${JSON.stringify(profile.projects)}
- Trainings: ${JSON.stringify(profile.trainings)}

Performance Data: ${JSON.stringify(performanceData)}

Provide a 9-box talent matrix mapping with:
1. Performance axis (1-3): Low, Medium, High
2. Potential axis (1-3): Low, Medium, High
3. Quadrant classification
4. Career recommendations
5. Development areas
6. Suitable positions
7. Risk assessment

Return JSON:
{
  "performance": {"score": 1-3, "level": "Low|Medium|High", "justification": "why"},
  "potential": {"score": 1-3, "level": "Low|Medium|High", "justification": "why"},
  "quadrant": {"x": 1-3, "y": 1-3, "category": "category name", "description": "description"},
  "talentBox": "High Performer|High Potential|Solid Professional|Underperformer|etc",
  "careerPath": ["recommended positions"],
  "developmentAreas": ["areas to develop"],
  "suitablePositions": [{"position": "title", "fit": 0-100, "reason": "why"}],
  "riskLevel": "Low|Medium|High",
  "recommendations": ["detailed recommendations"]
}`;
      
        const response = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in talent management and 9-box grid analysis for civil service personnel.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        });
      
        mapping = JSON.parse(response.choices[0].message.content);
      }
      
      // Save to MongoDB
      const client = await clientPromise;
      const db = client.db('asta_cita_ai');
      await db.collection('talent_mappings').insertOne({
        nip,
        mapping,
        timestamp: new Date()
      });
      
      return NextResponse.json({ mapping, profile });
    } catch (error) {
      console.error('Error generating talent mapping:', error);
      return NextResponse.json(
        { error: 'Failed to generate talent mapping', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Skill analysis
  if (segments[0] === 'skill-analysis' && method === 'POST') {
    try {
      const { nip } = await request.json();
      
      const profile = getASNProfile(nip);
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }
      
      let analysis;
      
      if (USE_MOCK_MODE) {
        // Use mock AI response for demonstration
        analysis = getMockSkillAnalysis(profile);
      } else {
        // Use actual OpenAI API
        const prompt = `Perform a deep skill analysis for this ASN:

Technical Skills: ${JSON.stringify(profile.skills.technical)}
Soft Skills: ${JSON.stringify(profile.skills.soft)}
Projects: ${JSON.stringify(profile.projects)}
Training: ${JSON.stringify(profile.trainings)}

Provide:
1. Skill proficiency scores (0-100)
2. Skill gaps for their position
3. Emerging skills needed
4. Skill development roadmap
5. Benchmark against industry standards

Return JSON:
{
  "technicalSkills": [{"skill": "name", "proficiency": 0-100, "benchmark": 0-100, "gap": 0-100}],
  "softSkills": [{"skill": "name", "proficiency": 0-100, "importance": 0-100}],
  "skillGaps": [{"skill": "name", "currentLevel": 0-100, "requiredLevel": 0-100, "priority": "High|Medium|Low"}],
  "emergingSkills": [{"skill": "name", "relevance": "description", "learningPath": "suggestion"}],
  "developmentRoadmap": [{"phase": "1-3 months", "skills": ["list"], "resources": ["list"]}],
  "overallScore": 0-100
}`;
      
        const response = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in skill assessment and competency development for civil servants.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        });
      
        analysis = JSON.parse(response.choices[0].message.content);
      }
      
      return NextResponse.json({ analysis, profile });
    } catch (error) {
      console.error('Error in skill analysis:', error);
      return NextResponse.json(
        { error: 'Failed to perform skill analysis', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Update portfolio link
  if (segments[0] === 'update-portfolio' && method === 'POST') {
    try {
      const { nip, portfolioLink } = await request.json();
      
      const client = await clientPromise;
      const db = client.db('asta_cita_ai');
      
      await db.collection('profiles').updateOne(
        { nip },
        { 
          $set: { 
            portfolioLink,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
      
      return NextResponse.json({ 
        success: true,
        message: 'Portfolio link updated successfully' 
      });
    } catch (error) {
      console.error('Error updating portfolio:', error);
      return NextResponse.json(
        { error: 'Failed to update portfolio link', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Upload certifications
  if (segments[0] === 'upload-certifications' && method === 'POST') {
    try {
      const { nip, certifications } = await request.json();
      
      const client = await clientPromise;
      const db = client.db('asta_cita_ai');
      
      // Store certifications
      await db.collection('certifications').insertOne({
        nip,
        certifications,
        uploadedAt: new Date()
      });
      
      // Update profile with certification count
      await db.collection('profiles').updateOne(
        { nip },
        { 
          $inc: { certificationCount: certifications.length },
          $set: { lastCertificationUpload: new Date() }
        },
        { upsert: true }
      );
      
      return NextResponse.json({ 
        success: true,
        message: 'Certifications uploaded successfully',
        count: certifications.length
      });
    } catch (error) {
      console.error('Error uploading certifications:', error);
      return NextResponse.json(
        { error: 'Failed to upload certifications', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Extract portfolio data
  if (segments[0] === 'extract-portfolio' && method === 'POST') {
    try {
      const { nip, portfolioLink } = await request.json();
      
      let extractedData;
      
      // Check if mock mode or use real OpenAI
      if (USE_MOCK_MODE || !openai) {
        // Mock extracted data for demo
        extractedData = {
          skills: {
            technical: ["Python", "JavaScript", "React", "Node.js", "MongoDB", "AWS", "Docker"],
            soft: ["Leadership", "Communication", "Problem Solving", "Team Collaboration", "Time Management"]
          },
          experience: [
            {
              title: "Senior Developer",
              company: "Tech Company",
              duration: "2020 - Present",
              description: "Leading development team and architecting scalable solutions"
            },
            {
              title: "Software Engineer",
              company: "Startup Inc",
              duration: "2018 - 2020",
              description: "Full-stack development and system design"
            }
          ],
          education: [
            {
              degree: "Bachelor of Computer Science",
              institution: "Top University",
              year: "2018"
            }
          ],
          certifications: [
            "AWS Certified Solutions Architect",
            "Professional Scrum Master",
            "Google Cloud Professional"
          ],
          achievements: [
            "Led successful digital transformation project",
            "Improved system performance by 40%",
            "Mentored 10+ junior developers"
          ],
          summary: "Experienced software engineer with strong technical skills and proven leadership abilities. Specialized in full-stack development and cloud architecture.",
          competencyScore: 85
        };
      } else {
        // Use real OpenAI for extraction
        const prompt = `Extract professional information from this portfolio/profile link: ${portfolioLink}

Please analyze and extract:
1. Skills and expertise (technical and soft skills)
2. Work experience and projects
3. Education and certifications
4. Achievements and accomplishments
5. Professional summary

Return structured JSON:
{
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["skill1", "skill2"]
  },
  "experience": [{"title": "position", "company": "name", "duration": "period", "description": "details"}],
  "education": [{"degree": "name", "institution": "name", "year": "year"}],
  "certifications": ["cert1", "cert2"],
  "achievements": ["achievement1", "achievement2"],
  "summary": "professional summary",
  "competencyScore": 0-100
}`;

        const response = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at extracting and analyzing professional data from portfolio links, LinkedIn profiles, and GitHub profiles. Extract meaningful career information even if you cannot directly access the URL.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        });
        
        extractedData = JSON.parse(response.choices[0].message.content);
      }
      
      // Save extracted data to MongoDB
      const client = await clientPromise;
      const db = client.db('asta_cita_ai');
      
      await db.collection('portfolio_data').updateOne(
        { nip },
        { 
          $set: {
            portfolioLink,
            extractedData,
            extractedAt: new Date()
          }
        },
        { upsert: true }
      );
      
      // Update profile with portfolio data
      await db.collection('profiles').updateOne(
        { nip },
        { 
          $set: { 
            portfolioLink,
            hasPortfolioData: true,
            lastPortfolioUpdate: new Date()
          }
        },
        { upsert: true }
      );
      
      return NextResponse.json({ 
        success: true,
        extractedData,
        message: 'Portfolio data extracted and saved successfully' 
      });
    } catch (error) {
      console.error('Error extracting portfolio:', error);
      return NextResponse.json(
        { error: 'Failed to extract portfolio data', details: error.message },
        { status: 500 }
      );
    }
  }
  
  return null;
}

// Performance Assessment endpoints
async function handlePerformanceAssessment(segments, request, method) {
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Get all performance data
  if (segments[0] === 'all' && method === 'GET') {
    return NextResponse.json({ data: getAllPerformanceData() });
  }
  
  // Get performance for specific NIP
  if (segments[0] === 'by-nip' && segments[1] && method === 'GET') {
    const nip = segments[1];
    const data = getPerformanceData(nip);
    if (!data) {
      return NextResponse.json({ error: 'Performance data not found' }, { status: 404 });
    }
    return NextResponse.json({ data });
  }
  
  // AI-powered performance analysis
  if (segments[0] === 'analyze' && method === 'POST') {
    try {
      const { nip } = await request.json();
      
      const performanceData = getPerformanceData(nip);
      const profile = getASNProfile(nip);
      
      if (!performanceData || !profile) {
        return NextResponse.json({ error: 'Data not found' }, { status: 404 });
      }
      
      let analysis;
      
      if (USE_MOCK_MODE) {
        // Use mock AI response for demonstration
        analysis = getMockPerformanceAnalysis(profile, performanceData);
      } else {
        // Use actual OpenAI API
        const prompt = `Analyze this ASN's performance data comprehensively:

Profile: ${JSON.stringify(profile)}
Performance Data: ${JSON.stringify(performanceData)}

Provide:
1. Performance quadrant classification (4-quadrant model)
2. Strength areas
3. Improvement areas
4. Performance trends
5. Risk factors
6. Actionable recommendations (technical & non-technical development)

Return JSON:
{
  "quadrant": {"category": "name", "x": 0-100, "y": 0-100, "description": "description"},
  "classification": "Excellent|Very Good|Good|Needs Improvement|Poor",
  "strengths": [{"area": "name", "score": 0-100, "evidence": "description"}],
  "weaknesses": [{"area": "name", "score": 0-100, "impact": "description"}],
  "trends": {"direction": "improving|stable|declining", "analysis": "description"},
  "riskFactors": [{"factor": "name", "severity": "High|Medium|Low", "mitigation": "suggestion"}],
  "recommendations": {
    "technical": [{"action": "description", "priority": "High|Medium|Low", "timeline": "duration"}],
    "nonTechnical": [{"action": "description", "type": "training|seminar|mentoring|etc", "benefit": "description"}]
  },
  "developmentPlan": [{"quarter": "Q1-Q4", "focus": "area", "activities": ["list"]}]
}`;
      
        const response = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in performance management and organizational development for civil servants.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        });
      
        analysis = JSON.parse(response.choices[0].message.content);
      }
      
      // Save to MongoDB
      const client = await clientPromise;
      const db = client.db('asta_cita_ai');
      await db.collection('performance_analyses').insertOne({
        nip,
        analysis,
        timestamp: new Date()
      });
      
      return NextResponse.json({ analysis, performanceData, profile });
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return NextResponse.json(
        { error: 'Failed to analyze performance', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Get ASN news and trends
  if (segments[0] === 'news' && method === 'GET') {
    return NextResponse.json({ news: mockASNNews });
  }
  
  return null;
}

// Mock BKN API endpoints
async function handleMockBKN(segments, request, method) {
  if (segments[0] === 'kemenkeu' && segments[1] === 'performance' && method === 'GET') {
    const data = mockPerformanceData.filter(d => d.agency === 'Kementerian Keuangan');
    return NextResponse.json({ agency: 'Kementerian Keuangan', method: 'SKI', data });
  }
  
  if (segments[0] === 'kemendikbud' && segments[1] === 'performance' && method === 'GET') {
    const data = mockPerformanceData.filter(d => d.agency === 'Kementerian Pendidikan');
    return NextResponse.json({ agency: 'Kementerian Pendidikan', method: 'PKA', data });
  }
  
  if (segments[0] === 'kemendagri' && segments[1] === 'performance' && method === 'GET') {
    const data = mockPerformanceData.filter(d => d.agency === 'Kementerian Dalam Negeri');
    return NextResponse.json({ agency: 'Kementerian Dalam Negeri', method: 'EKB', data });
  }
  
  return null;
}

// Main router
export async function GET(request) {
  const segments = getPathSegments(request);
  
  if (segments[0] === 'auth') {
    return handleAuth(segments.slice(1), request, 'GET');
  }
  
  if (segments[0] === 'talent') {
    return handleTalentManagement(segments.slice(1), request, 'GET');
  }
  
  if (segments[0] === 'performance') {
    return handlePerformanceAssessment(segments.slice(1), request, 'GET');
  }
  
  if (segments[0] === 'mock-bkn') {
    return handleMockBKN(segments.slice(1), request, 'GET');
  }
  
  return NextResponse.json({ message: 'ASTA-CITA AI API' });
}

export async function POST(request) {
  const segments = getPathSegments(request);
  
  if (segments[0] === 'auth') {
    return handleAuth(segments.slice(1), request, 'POST');
  }
  
  if (segments[0] === 'talent') {
    return handleTalentManagement(segments.slice(1), request, 'POST');
  }
  
  if (segments[0] === 'performance') {
    return handlePerformanceAssessment(segments.slice(1), request, 'POST');
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}