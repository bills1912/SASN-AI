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
import mockInstitutions, { generateInstitutionAnalysis } from '@/lib/mockMeritData';
import { getBlockchainInstance } from '@/lib/blockchain';
import { seedBlockchainData } from '@/lib/seedBlockchainData';

// Helper to extract path segments
function getPathSegments(request) {
  const url = new URL(request.url);
  const pathname = url.pathname.replace('/api/', '');
  return pathname.split('/').filter(Boolean);
}

// Helper for authentication
function verifyAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔐 Auth check - Header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('⚠️ No valid Authorization header found');
      return null;
    }
    
    const token = authHeader.substring(7);
    console.log('🔐 Token extracted, length:', token.length);
    
    const user = verifyMockToken(token);
    if (user) {
      console.log('✓ Auth successful:', user.username, user.role);
    } else {
      console.warn('❌ Token verification failed');
    }
    
    return user;
  } catch (error) {
    console.error('❌ Error in verifyAuth:', error);
    return null;
  }
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
  // ALL endpoints public for deployment demo
  const publicEndpoints = [
    'institutions-list',
    'analyze-institution-bulk',
    'institution-employees',
    'institution-analysis',
    'export-institution-analysis',
    'talent-mapping',
    'profiles'
  ];
  
  const isPublicEndpoint = publicEndpoints.includes(segments[0]);
  
  let user = null;
  if (!isPublicEndpoint) {
    user = verifyAuth(request);
    if (!user) {
      console.error(`❌ Unauthorized access attempt to /api/talent/${segments[0]}`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`✓ Authenticated user: ${user.username} (${user.role})`);
  } else {
    console.log(`📢 Public endpoint accessed: /api/talent/${segments[0]}`);
    user = verifyAuth(request);
    if (user) {
      console.log(`✓ Optional auth: ${user.username} (${user.role})`);
    } else {
      console.log(`ℹ️ No auth - using public access`);
      user = {
        id: 'public-admin',
        username: 'public',
        role: 'admin',
        name: 'Administrator',
        institution: 'Kementerian Keuangan'
      };
    }
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
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
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
      console.log(`🔍 Talent mapping request for NIP: ${nip}`);
      console.log(`🌍 Environment check:`, {
        MONGO_URL: process.env.MONGO_URL ? 'SET' : 'NOT SET',
        MONGO_DB_NAME: process.env.MONGO_DB_NAME || 'USING DEFAULT',
        USE_MOCK_MODE,
        NODE_ENV: process.env.NODE_ENV
      });
      
      const profile = getASNProfile(nip);
      if (!profile) {
        console.error(`❌ Profile not found for NIP: ${nip}`);
        return NextResponse.json({ 
          error: 'Profile not found', 
          details: `No ASN profile exists for NIP: ${nip}. Please check the NIP and try again.` 
        }, { status: 404 });
      }
      
      console.log(`✓ Profile found: ${profile.name} (${profile.position})`);
      const performanceData = getPerformanceData(nip);
      console.log(`✓ Performance data retrieved, USE_MOCK_MODE: ${USE_MOCK_MODE}`);
      
      let mapping;
      
      try {
        if (USE_MOCK_MODE) {
          // Use mock AI response for demonstration
          console.log('📊 Using mock talent mapping');
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
        console.log('✓ OpenAI talent mapping generated');
      }
      } catch (mappingError) {
        console.error('⚠️ Error generating mapping (falling back to mock):', mappingError.message);
        // Fallback to mock if OpenAI fails
        mapping = getMockTalentMapping(profile);
        console.log('✓ Using fallback mock talent mapping');
      }
      
      // Save to MongoDB (with error handling for deployment)
      try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
        await db.collection('talent_mappings').insertOne({
          nip,
          mapping,
          timestamp: new Date()
        });
        console.log(`✓ Talent mapping saved to MongoDB for NIP: ${nip}`);
      } catch (dbError) {
        console.warn('MongoDB save failed (continuing without save):', dbError.message);
        // Continue without saving to MongoDB - not a critical failure
      }
      
      return NextResponse.json({ mapping, profile });
    } catch (error) {
      console.error('Error generating talent mapping:', error);
      console.error('Error stack:', error.stack);
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
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      
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
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      
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
      
      console.log('=== Starting Portfolio Extraction ===');
      console.log('Link:', portfolioLink);
      
      let extractedData;
      let scrapedContent = '';
      let scrapedHTML = '';
      
      // Step 1: Fetch and scrape content from the URL
      const axios = require('axios');
      const cheerio = require('cheerio');
      
      try {
        console.log('Fetching URL...');
        
        const response = await axios.get(portfolioLink, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          timeout: 15000,
          maxRedirects: 5
        });
        
        scrapedHTML = response.data;
        const $ = cheerio.load(scrapedHTML);
        
        console.log('HTML loaded, extracting content...');
        
        // Remove unwanted elements
        $('script, style, noscript, iframe, nav, footer, header, aside, .cookie, .popup, .modal').remove();
        
        // Extract structured data
        const extractedInfo = {
          title: $('title').text() || '',
          headings: [],
          paragraphs: [],
          lists: [],
          links: []
        };
        
        // Extract headings
        $('h1, h2, h3, h4').each((i, elem) => {
          const text = $(elem).text().trim();
          if (text.length > 2 && text.length < 200) {
            extractedInfo.headings.push(text);
          }
        });
        
        // Extract paragraphs
        $('p').each((i, elem) => {
          const text = $(elem).text().trim();
          if (text.length > 20 && text.length < 1000) {
            extractedInfo.paragraphs.push(text);
          }
        });
        
        // Extract lists
        $('li').each((i, elem) => {
          const text = $(elem).text().trim();
          if (text.length > 5 && text.length < 500) {
            extractedInfo.lists.push(text);
          }
        });
        
        // Extract links for GitHub/LinkedIn profiles
        $('a[href]').each((i, elem) => {
          const href = $(elem).attr('href');
          const text = $(elem).text().trim();
          if (href && (href.includes('github.com') || href.includes('linkedin.com'))) {
            extractedInfo.links.push({ text, href });
          }
        });
        
        // Combine all text
        scrapedContent = [
          `Title: ${extractedInfo.title}`,
          '\n=== Headings ===',
          extractedInfo.headings.join('\n'),
          '\n=== Content ===',
          extractedInfo.paragraphs.slice(0, 20).join('\n'),
          '\n=== Lists ===',
          extractedInfo.lists.slice(0, 30).join('\n')
        ].join('\n');
        
        console.log('Scraped content length:', scrapedContent.length);
        console.log('Headings found:', extractedInfo.headings.length);
        console.log('Paragraphs found:', extractedInfo.paragraphs.length);
        
      } catch (scrapeError) {
        console.error('Scraping error:', scrapeError.message);
        scrapedContent = `Failed to scrape URL: ${scrapeError.message}. Analyzing URL structure only.`;
      }
      
      // Step 2: Try AI extraction first
      if (!USE_MOCK_MODE && openai && scrapedContent.length > 100) {
        try {
          console.log('Using OpenAI for extraction...');
          
          const prompt = `Analyze this scraped portfolio/profile content and extract structured professional information:

${scrapedContent.substring(0, 7000)}

Source URL: ${portfolioLink}

Extract and return valid JSON with this exact structure:
{
  "skills": {
    "technical": ["array of technical skills found in the content"],
    "soft": ["array of soft skills or competencies mentioned"]
  },
  "experience": [
    {
      "title": "job title if found",
      "company": "company name if found",
      "duration": "time period if found",
      "description": "brief description of role"
    }
  ],
  "education": [
    {
      "degree": "degree name if found",
      "institution": "school/university if found",
      "year": "year if found"
    }
  ],
  "certifications": ["list any certifications, courses, or training mentioned"],
  "achievements": ["list notable achievements, awards, or accomplishments"],
  "summary": "write a 2-3 sentence professional summary based on the content",
  "competencyScore": 75
}

IMPORTANT: Only include information that is actually found in the content. If a section has no data, use empty arrays. Make realistic estimates for competencyScore (0-100) based on available information.`;

          const aiResponse = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are an expert at analyzing professional portfolios. Extract only real information from the provided content. Do not fabricate data. Return valid JSON only.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          });
          
          extractedData = JSON.parse(aiResponse.choices[0].message.content);
          console.log('OpenAI extraction successful');
          
        } catch (aiError) {
          console.error('AI extraction failed:', aiError.message);
          // Fall through to manual extraction
        }
      }
      
      // Step 3: Manual intelligent extraction if AI fails or not available
      if (!extractedData) {
        console.log('Using manual extraction...');
        
        const textLower = scrapedContent.toLowerCase();
        
        // Extract skills by looking for common patterns
        const skillKeywords = {
          technical: ['python', 'javascript', 'java', 'react', 'node', 'angular', 'vue', 'typescript', 'html', 'css', 
                     'sql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes', 'git', 'api', 'rest',
                     'machine learning', 'ai', 'data science', 'tensorflow', 'pytorch', 'django', 'flask', 'spring'],
          soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'creative', 
                'management', 'collaboration', 'presentation', 'negotiation']
        };
        
        const foundSkills = {
          technical: [],
          soft: []
        };
        
        // Find technical skills
        skillKeywords.technical.forEach(skill => {
          if (textLower.includes(skill.toLowerCase())) {
            foundSkills.technical.push(skill.charAt(0).toUpperCase() + skill.slice(1));
          }
        });
        
        // Find soft skills
        skillKeywords.soft.forEach(skill => {
          if (textLower.includes(skill.toLowerCase())) {
            foundSkills.soft.push(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
          }
        });
        
        // Extract experience by looking for job-related keywords
        const experience = [];
        const experienceKeywords = ['developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant', 'specialist', 'lead', 'senior', 'junior'];
        
        scrapedContent.split('\n').forEach(line => {
          if (experienceKeywords.some(kw => line.toLowerCase().includes(kw)) && line.length > 10 && line.length < 200) {
            const yearMatch = line.match(/\b(19|20)\d{2}\b/);
            experience.push({
              title: line.trim().substring(0, 100),
              company: "Information extracted from portfolio",
              duration: yearMatch ? `${yearMatch[0]}` : "See portfolio for details",
              description: "Details available in original portfolio"
            });
          }
        });
        
        // Extract education
        const education = [];
        const eduKeywords = ['university', 'college', 'bachelor', 'master', 'phd', 'degree', 'diploma'];
        
        scrapedContent.split('\n').forEach(line => {
          if (eduKeywords.some(kw => line.toLowerCase().includes(kw)) && line.length > 10 && line.length < 200) {
            education.push({
              degree: line.trim().substring(0, 100),
              institution: "See portfolio for details",
              year: ""
            });
          }
        });
        
        // Extract certifications
        const certifications = [];
        const certKeywords = ['certified', 'certification', 'certificate', 'course', 'training', 'workshop'];
        
        scrapedContent.split('\n').forEach(line => {
          if (certKeywords.some(kw => line.toLowerCase().includes(kw)) && line.length > 10 && line.length < 200) {
            certifications.push(line.trim().substring(0, 100));
          }
        });
        
        // Generate summary from first few paragraphs
        const firstParagraphs = scrapedContent.split('\n')
          .filter(line => line.length > 50)
          .slice(0, 3)
          .join(' ')
          .substring(0, 300);
        
        const summary = firstParagraphs || 
          `Professional profile extracted from ${portfolioLink}. ${foundSkills.technical.length > 0 ? `Skills include ${foundSkills.technical.slice(0, 3).join(', ')}.` : 'See full portfolio for details.'}`;
        
        // Calculate competency score based on found data
        let score = 50; // base score
        if (foundSkills.technical.length > 0) score += Math.min(foundSkills.technical.length * 3, 20);
        if (experience.length > 0) score += Math.min(experience.length * 5, 15);
        if (education.length > 0) score += 10;
        if (certifications.length > 0) score += 5;
        
        extractedData = {
          skills: foundSkills.technical.length > 0 || foundSkills.soft.length > 0 ? foundSkills : {
            technical: ["Data extracted from portfolio - see full details at source"],
            soft: ["See portfolio for complete skill list"]
          },
          experience: experience.length > 0 ? experience.slice(0, 3) : [{
            title: "Professional Experience",
            company: "See portfolio for details",
            duration: "Available in portfolio",
            description: `Extracted from ${portfolioLink}`
          }],
          education: education.length > 0 ? education.slice(0, 2) : [{
            degree: "Education details available in portfolio",
            institution: portfolioLink,
            year: ""
          }],
          certifications: certifications.length > 0 ? certifications.slice(0, 5) : ["See portfolio for certifications"],
          achievements: ["Portfolio successfully analyzed", `${scrapedContent.length} characters of content extracted`],
          summary: summary,
          competencyScore: Math.min(score, 95)
        };
        
        console.log('Manual extraction complete');
        console.log('Skills found:', foundSkills.technical.length + foundSkills.soft.length);
      }
      
      // Save to MongoDB
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      
      await db.collection('portfolio_data').updateOne(
        { nip },
        { 
          $set: {
            portfolioLink,
            extractedData,
            scrapedContentLength: scrapedContent.length,
            extractedAt: new Date(),
            extractionMethod: extractedData ? (USE_MOCK_MODE ? 'manual' : 'ai') : 'manual'
          }
        },
        { upsert: true }
      );
      
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
      
      console.log('=== Extraction Complete ===');
      console.log('Data saved to MongoDB');
      
      return NextResponse.json({ 
        success: true,
        extractedData,
        scrapedContentLength: scrapedContent.length,
        extractionMethod: extractedData ? (USE_MOCK_MODE ? 'manual' : 'ai+manual') : 'manual',
        message: 'Portfolio data extracted and saved successfully' 
      });
      
    } catch (error) {
      console.error('=== Extraction Error ===');
      console.error(error);
      return NextResponse.json(
        { error: 'Failed to extract portfolio data', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // Analyze institution - bulk analysis for all employees (Admin only)
  if (segments[0] === 'analyze-institution-bulk' && method === 'POST') {
    try {
      console.log('🔍 Bulk institution analysis requested');
      console.log(`User: ${user?.username} (${user?.role})`);
      
      // Only admin can access
      if (!user || user.role !== 'admin') {
        console.error(`❌ Forbidden - User ${user?.username || 'unknown'} is not admin`);
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }

      const { institutionName } = await request.json();
      console.log(`📊 Analyzing institution: ${institutionName}`);
      
      if (!institutionName) {
        return NextResponse.json({ error: 'Institution name is required' }, { status: 400 });
      }

      // Get all profiles from this institution
      const allProfiles = getAllASNProfiles();
      const institutionProfiles = allProfiles.filter(p => p.agency === institutionName);

      if (institutionProfiles.length === 0) {
        console.warn(`⚠️ No employees found for ${institutionName}`);
        return NextResponse.json({ error: 'No employees found for this institution' }, { status: 404 });
      }

      console.log(`✓ Found ${institutionProfiles.length} employees from ${institutionName}`);

      const employeeResults = [];

      // Analyze each employee
      for (const profile of institutionProfiles) {
        try {
          const performanceData = getPerformanceData(profile.nip);
          
          let mapping;
          
          if (USE_MOCK_MODE) {
            mapping = getMockTalentMapping(profile);
          } else {
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

          // Store result
          employeeResults.push({
            nip: profile.nip,
            name: profile.name,
            position: profile.position,
            talentBox: mapping.talentBox,
            boxNumber: mapping.boxNumber || 5,
            performance: mapping.performance,
            potential: mapping.potential,
            recommendedPositions: mapping.suitablePositions || mapping.careerPath || [],
            priority: mapping.priority || 'Medium',
            riskLevel: mapping.riskLevel,
            developmentAreas: mapping.developmentAreas || [],
            fullAnalysis: mapping
          });

          console.log(`✓ Analyzed: ${profile.name} - ${mapping.talentBox}`);

        } catch (error) {
          console.error(`Error analyzing ${profile.name}:`, error.message);
          // Continue with other employees even if one fails
          employeeResults.push({
            nip: profile.nip,
            name: profile.name,
            position: profile.position,
            talentBox: 'Analysis Failed',
            boxNumber: 0,
            error: error.message
          });
        }
      }

      console.log(`✓ All ${employeeResults.length} employees analyzed successfully`);

      // Save to MongoDB (with fallback and detailed logging)
      try {
        console.log('💾 Attempting to save analysis to MongoDB...');
        console.log(`   Institution: ${institutionName}`);
        console.log(`   User ID: ${user?.id || 'unknown'}`);
        console.log(`   User Name: ${user?.name || 'Unknown User'}`);
        console.log(`   Total employees: ${employeeResults.length}`);
        
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
        console.log(`✓ MongoDB connected, DB: ${process.env.MONGO_DB_NAME || 'astacita'}`);
        
        const analysisDoc = {
          institutionName,
          analyzedBy: user?.id || 'public-admin',
          analyzedByName: user?.name || 'Administrator',
          analyzedAt: new Date(),
          employees: employeeResults,
          totalEmployees: employeeResults.length,
          summary: {
            successfulAnalyses: employeeResults.filter(e => !e.error).length,
            failedAnalyses: employeeResults.filter(e => e.error).length
          }
        };

        const result = await db.collection('institution_talent_analyses').updateOne(
          { institutionName },
          { $set: analysisDoc },
          { upsert: true }
        );
        
        console.log(`✓ MongoDB operation result:`, {
          matched: result.matchedCount,
          modified: result.modifiedCount,
          upserted: result.upsertedCount,
          upsertedId: result.upsertedId
        });
        console.log(`✅ Analysis saved to MongoDB for ${institutionName}`);

        return NextResponse.json({
          success: true,
          institutionName,
          totalEmployees: employeeResults.length,
          employees: employeeResults,
          summary: analysisDoc.summary,
          analyzedAt: analysisDoc.analyzedAt,
          savedToDatabase: true
        });
      } catch (mongoError) {
        console.error('❌ MongoDB save failed:', mongoError);
        console.error('   Error name:', mongoError.name);
        console.error('   Error message:', mongoError.message);
        console.error('   Error stack:', mongoError.stack);
        
        // Return analysis even if MongoDB save fails
        return NextResponse.json({
          success: true,
          institutionName,
          totalEmployees: employeeResults.length,
          employees: employeeResults,
          summary: {
            successfulAnalyses: employeeResults.filter(e => !e.error).length,
            failedAnalyses: employeeResults.filter(e => e.error).length
          },
          analyzedAt: new Date(),
          savedToDatabase: false,
          warning: 'Analysis completed but not saved to database',
          error: mongoError.message
        });
      }

    } catch (error) {
      console.error('Error in bulk institution analysis:', error);
      return NextResponse.json(
        { error: 'Failed to analyze institution', details: error.message },
        { status: 500 }
      );
    }
  }

  // Get institution analysis results
  if (segments[0] === 'institution-analysis' && segments[1] && method === 'GET') {
    try {
      console.log('📊 Fetching institution analysis...');
      const institutionName = decodeURIComponent(segments[1]);
      console.log(`   Institution: ${institutionName}`);
      console.log(`   User: ${user?.username || 'none'} (${user?.role || 'none'})`);
      console.log(`   User institution: ${user?.institution || 'none'}`);

      // Allow admin and kepala_instansi (but kepala can only see their own institution)
      if (user && user.role === 'kepala_instansi' && user.institution !== institutionName) {
        console.error(`❌ Forbidden - User ${user.username} trying to access ${institutionName}, but belongs to ${user.institution}`);
        return NextResponse.json({ error: 'Forbidden - You can only view your institution' }, { status: 403 });
      }

      console.log('✓ Access check passed');
      console.log(`💾 Connecting to MongoDB...`);
      console.log(`   MONGO_DB_NAME: ${process.env.MONGO_DB_NAME || 'DEFAULT: text-spacing'}`);
      
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      console.log(`✓ MongoDB connected`);
      
      console.log(`🔍 Querying collection: institution_talent_analyses`);
      console.log(`   Query: { institutionName: "${institutionName}" }`);
      
      const analysis = await db.collection('institution_talent_analyses').findOne({ institutionName });
      
      if (!analysis) {
        console.warn(`⚠️ No analysis found for: ${institutionName}`);
        return NextResponse.json({ 
          error: 'No analysis found for this institution',
          message: 'Please run the analysis first',
          institutionName: institutionName
        }, { status: 404 });
      }

      console.log(`✅ Analysis found for ${institutionName}`);
      console.log(`   Employees: ${analysis.totalEmployees}`);
      console.log(`   Analyzed at: ${analysis.analyzedAt}`);

      return NextResponse.json({
        success: true,
        analysis
      });

    } catch (error) {
      console.error('❌ Error fetching institution analysis:', error);
      console.error('   Error name:', error.name);
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch institution analysis', 
          details: error.message,
          institutionName: segments[1]
        },
        { status: 500 }
      );
    }
  }

  // Get employees for institution (for kepala_instansi)
  if (segments[0] === 'institution-employees' && segments[1] && method === 'GET') {
    try {
      const institutionName = decodeURIComponent(segments[1]);

      // Kepala can only see their own institution
      if (user.role === 'kepala_instansi' && user.institution !== institutionName) {
        return NextResponse.json({ error: 'Forbidden - You can only view your institution' }, { status: 403 });
      }

      const allProfiles = getAllASNProfiles();
      const employees = allProfiles.filter(p => p.agency === institutionName);

      // Try to get analysis if exists
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      const analysis = await db.collection('institution_talent_analyses').findOne({ institutionName });

      return NextResponse.json({
        success: true,
        institutionName,
        employees,
        totalEmployees: employees.length,
        hasAnalysis: !!analysis,
        analysis: analysis || null
      });

    } catch (error) {
      console.error('Error fetching institution employees:', error);
      return NextResponse.json(
        { error: 'Failed to fetch employees', details: error.message },
        { status: 500 }
      );
    }
  }

  // Export institution analysis (Excel/CSV format as JSON)
  if (segments[0] === 'export-institution-analysis' && segments[1] && method === 'GET') {
    try {
      const institutionName = decodeURIComponent(segments[1]);

      // Check permissions
      if (user.role === 'kepala_instansi' && user.institution !== institutionName) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      
      const analysis = await db.collection('institution_talent_analyses').findOne({ institutionName });

      if (!analysis) {
        return NextResponse.json({ error: 'No analysis found' }, { status: 404 });
      }

      // Prepare export data
      const exportData = {
        institutionName: analysis.institutionName,
        analyzedAt: analysis.analyzedAt,
        analyzedBy: analysis.analyzedByName,
        totalEmployees: analysis.totalEmployees,
        employees: analysis.employees.map(emp => ({
          NIP: emp.nip,
          Nama: emp.name,
          Jabatan: emp.position,
          'Kategori 9-Box': emp.talentBox,
          'Box Number': emp.boxNumber,
          'Performance Level': emp.performance?.level || '-',
          'Performance Score': emp.performance?.score || '-',
          'Potential Level': emp.potential?.level || '-',
          'Potential Score': emp.potential?.score || '-',
          'Rekomendasi Jabatan': emp.recommendedPositions.map(p => 
            typeof p === 'string' ? p : p.position
          ).join('; '),
          'Priority': emp.priority,
          'Risk Level': emp.riskLevel
        }))
      };

      return NextResponse.json({
        success: true,
        exportData,
        filename: `Analisis_Talenta_${institutionName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`
      });

    } catch (error) {
      console.error('Error exporting analysis:', error);
      return NextResponse.json(
        { error: 'Failed to export', details: error.message },
        { status: 500 }
      );
    }
  }

  // Get available institutions list
  if (segments[0] === 'institutions-list' && method === 'GET') {
    try {
      console.log('📋 Fetching institutions list...');
      const allProfiles = getAllASNProfiles();
      const institutions = [...new Set(allProfiles.map(p => p.agency))];
      console.log(`✓ Found ${institutions.length} unique institutions from profiles`);
      
      let institutionsWithStatus;
      
      try {
        // Try to get analysis status from MongoDB
        const client = await clientPromise;
        const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
        console.log(`✓ MongoDB connected, DB: ${process.env.MONGO_DB_NAME || 'astacita'}`);
        
        institutionsWithStatus = await Promise.all(
          institutions.map(async (inst) => {
            try {
              const analysis = await db.collection('institution_talent_analyses').findOne({ institutionName: inst });
              const employeeCount = allProfiles.filter(p => p.agency === inst).length;
              
              return {
                name: inst,
                employeeCount,
                hasAnalysis: !!analysis,
                lastAnalyzed: analysis?.analyzedAt || null,
                analyzedBy: analysis?.analyzedByName || null
              };
            } catch (instError) {
              console.warn(`⚠️ Error fetching analysis for ${inst}:`, instError.message);
              // Return basic info if query fails
              const employeeCount = allProfiles.filter(p => p.agency === inst).length;
              return {
                name: inst,
                employeeCount,
                hasAnalysis: false,
                lastAnalyzed: null,
                analyzedBy: null
              };
            }
          })
        );
        console.log('✓ Institution status fetched from MongoDB');
      } catch (mongoError) {
        console.warn('⚠️ MongoDB query failed, using fallback data:', mongoError.message);
        // Fallback: return basic institution list without analysis status
        institutionsWithStatus = institutions.map(inst => {
          const employeeCount = allProfiles.filter(p => p.agency === inst).length;
          return {
            name: inst,
            employeeCount,
            hasAnalysis: false,
            lastAnalyzed: null,
            analyzedBy: null
          };
        });
      }

      console.log(`✓ Returning ${institutionsWithStatus.length} institutions`);
      return NextResponse.json({
        success: true,
        institutions: institutionsWithStatus
      });

    } catch (error) {
      console.error('❌ Error fetching institutions:', error);
      console.error('Error stack:', error.stack);
      return NextResponse.json(
        { error: 'Failed to fetch institutions', details: error.message },
        { status: 500 }
      );
    }
  }

  // Extract resume/CV file
  if (segments[0] === 'extract-resume' && method === 'POST') {
    try {
      const { nip, fileName, fileData, fileType } = await request.json();
      
      console.log('=== Starting Resume Extraction ===');
      console.log('File:', fileName, 'Type:', fileType);
      
      let extractedText = '';
      
      // Decode base64
      const base64Data = fileData.split(',')[1];
      const buffer = Buffer.from(base64Data, 'base64');
      
      console.log('Buffer size:', buffer.length);
      
      // Extract text based on file type
      if (fileType === 'application/pdf') {
        const pdfParse = require('pdf-parse');
        try {
          const pdfData = await pdfParse(buffer);
          extractedText = pdfData.text;
          console.log('PDF text extracted, length:', extractedText.length);
        } catch (pdfError) {
          console.error('PDF parse error:', pdfError.message);
          throw new Error('Gagal membaca file PDF. Pastikan file tidak ter-enkripsi.');
        }
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileType === 'application/msword') {
        const mammoth = require('mammoth');
        try {
          const result = await mammoth.extractRawText({ buffer });
          extractedText = result.value;
          console.log('DOCX text extracted, length:', extractedText.length);
        } catch (docError) {
          console.error('DOCX parse error:', docError.message);
          throw new Error('Gagal membaca file Word.');
        }
      }
      
      if (!extractedText || extractedText.length < 50) {
        throw new Error('Tidak dapat mengekstrak teks dari file. Pastikan file berisi teks yang dapat dibaca.');
      }
      
      console.log('Text extracted successfully, analyzing...');
      
      // Use same extraction logic as portfolio
      let extractedData;
      
      // Try AI extraction first
      if (!USE_MOCK_MODE && openai) {
        try {
          const prompt = `Analyze this resume/CV text and extract structured professional information:

${extractedText.substring(0, 7000)}

Extract and return valid JSON:
{
  "skills": {
    "technical": ["array of technical skills"],
    "soft": ["array of soft skills"]
  },
  "experience": [
    {
      "title": "job title",
      "company": "company name",
      "duration": "time period",
      "description": "brief description"
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "institution name",
      "year": "year"
    }
  ],
  "certifications": ["list of certifications"],
  "achievements": ["list of achievements"],
  "summary": "professional summary",
  "competencyScore": 0-100
}`;

          const aiResponse = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || 'gpt-4o',
            messages: [
              { role: 'system', content: 'Extract professional data from resume text. Return valid JSON only.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
          });
          
          extractedData = JSON.parse(aiResponse.choices[0].message.content);
          console.log('AI extraction successful');
          
        } catch (aiError) {
          console.error('AI extraction failed:', aiError.message);
        }
      }
      
      // Manual extraction fallback
      if (!extractedData) {
        console.log('Using manual extraction from resume...');
        
        const textLower = extractedText.toLowerCase();
        const lines = extractedText.split('\n').filter(l => l.trim().length > 0);
        
        // Extract skills
        const skillKeywords = {
          technical: ['python', 'javascript', 'java', 'react', 'node', 'angular', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes', 'git'],
          soft: ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 'management']
        };
        
        const foundSkills = { technical: [], soft: [] };
        
        skillKeywords.technical.forEach(skill => {
          if (textLower.includes(skill)) {
            foundSkills.technical.push(skill.charAt(0).toUpperCase() + skill.slice(1));
          }
        });
        
        skillKeywords.soft.forEach(skill => {
          if (textLower.includes(skill)) {
            foundSkills.soft.push(skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
          }
        });
        
        // Extract email and phone (for summary)
        const emailMatch = extractedText.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phoneMatch = extractedText.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
        
        let score = 60;
        if (foundSkills.technical.length > 3) score += 15;
        if (extractedText.length > 1000) score += 10;
        if (emailMatch) score += 5;
        if (phoneMatch) score += 5;
        
        extractedData = {
          skills: foundSkills.technical.length > 0 ? foundSkills : {
            technical: ["Skills extracted from resume"],
            soft: ["See resume for details"]
          },
          experience: [{
            title: "Work Experience",
            company: "Details in resume",
            duration: "See resume",
            description: `Extracted from ${fileName}`
          }],
          education: [{
            degree: "Education details in resume",
            institution: fileName,
            year: ""
          }],
          certifications: ["Certifications listed in resume"],
          achievements: [`Resume analyzed: ${fileName}`, `${extractedText.length} characters processed`],
          summary: `Professional resume with ${foundSkills.technical.length + foundSkills.soft.length} skills identified. ${emailMatch ? `Contact: ${emailMatch[0]}` : ''}`,
          competencyScore: Math.min(score, 95)
        };
      }
      
      // Save to MongoDB
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      
      await db.collection('portfolio_data').updateOne(
        { nip },
        { 
          $set: {
            resumeFileName: fileName,
            extractedData,
            extractedTextLength: extractedText.length,
            extractedAt: new Date(),
            extractionMethod: 'resume_upload'
          }
        },
        { upsert: true }
      );
      
      await db.collection('profiles').updateOne(
        { nip },
        { 
          $set: { 
            hasResumeData: true,
            lastResumeUpload: new Date()
          }
        },
        { upsert: true }
      );
      
      console.log('=== Resume Extraction Complete ===');
      
      return NextResponse.json({ 
        success: true,
        extractedData,
        extractedTextLength: extractedText.length,
        message: 'Resume extracted successfully' 
      });
      
    } catch (error) {
      console.error('=== Resume Extraction Error ===');
      console.error(error);
      return NextResponse.json(
        { error: 'Failed to extract resume', details: error.message },
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
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
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

// Merit System Index endpoints (Admin only)
async function handleMeritSystem(segments, request, method) {
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Only admin can access merit system features
  if (user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
  }
  
  // GET /api/merit/institutions-list - Get all institutions
  if (segments[0] === 'institutions-list' && method === 'GET') {
    try {
      // In production, this would fetch from database
      // For now, return mock data
      return NextResponse.json({ 
        institutions: mockInstitutions,
        total: mockInstitutions.length,
        last_updated: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching institutions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch institutions' },
        { status: 500 }
      );
    }
  }
  
  // POST /api/merit/scrape-institutions - Trigger scraping (mock)
  if (segments[0] === 'scrape-institutions' && method === 'POST') {
    try {
      // Simulate scraping process
      console.log('Starting mock scraping process...');
      
      // In production, this would trigger actual web scraping
      // For now, return mock data with simulated delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return NextResponse.json({
        success: true,
        message: 'Scraping completed successfully',
        scraped_count: mockInstitutions.length,
        institutions: mockInstitutions,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error during scraping:', error);
      return NextResponse.json(
        { error: 'Scraping failed', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // POST /api/merit/analyze-institution - Analyze specific institution
  if (segments[0] === 'analyze-institution' && method === 'POST') {
    try {
      const { institution_id } = await request.json();
      
      const institution = mockInstitutions.find(i => i.id === institution_id);
      if (!institution) {
        return NextResponse.json(
          { error: 'Institution not found' },
          { status: 404 }
        );
      }
      
      const analysis = generateInstitutionAnalysis(institution);
      
      return NextResponse.json({
        success: true,
        institution: institution,
        analysis: analysis
      });
    } catch (error) {
      console.error('Error analyzing institution:', error);
      return NextResponse.json(
        { error: 'Analysis failed', details: error.message },
        { status: 500 }
      );
    }
  }
  
  // GET /api/merit/compare-institutions - Compare institutions
  if (segments[0] === 'compare-institutions' && method === 'GET') {
    try {
      // Sort by merit index
      const sortedInstitutions = [...mockInstitutions].sort(
        (a, b) => b.merit_index - a.merit_index
      );
      
      // Add rankings
      const rankedInstitutions = sortedInstitutions.map((inst, index) => ({
        ...inst,
        rank: index + 1
      }));
      
      return NextResponse.json({
        institutions: rankedInstitutions,
        total: rankedInstitutions.length,
        average_merit_index: (
          rankedInstitutions.reduce((sum, i) => sum + i.merit_index, 0) / 
          rankedInstitutions.length
        ).toFixed(2),
        highest_score: rankedInstitutions[0]?.merit_index || 0,
        lowest_score: rankedInstitutions[rankedInstitutions.length - 1]?.merit_index || 0
      });
    } catch (error) {
      console.error('Error comparing institutions:', error);
      return NextResponse.json(
        { error: 'Comparison failed' },
        { status: 500 }
      );
    }
  }
  
  // GET /api/merit/institution/:id - Get specific institution details
  if (segments[0] === 'institution' && segments[1] && method === 'GET') {
    try {
      const institutionId = segments[1];
      const institution = mockInstitutions.find(i => i.id === institutionId);
      
      if (!institution) {
        return NextResponse.json(
          { error: 'Institution not found' },
          { status: 404 }
        );
      }
      
      const analysis = generateInstitutionAnalysis(institution);
      
      return NextResponse.json({
        institution: institution,
        analysis: analysis
      });
    } catch (error) {
      console.error('Error fetching institution:', error);
      return NextResponse.json(
        { error: 'Failed to fetch institution details' },
        { status: 500 }
      );
    }
  }
  
  return null;
}

// Blockchain endpoints for Merit System
async function handleBlockchain(segments, request, method) {
  const user = verifyAuth(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const blockchain = getBlockchainInstance();

  // Auto-seed blockchain if empty (first time access)
  const stats = blockchain.getStatistics();
  if (stats.totalBlocks === 1 && segments[0] !== 'seed') { // Only genesis block
    try {
      seedBlockchainData();
    } catch (error) {
      console.error('Auto-seed error:', error);
    }
  }

  // GET /api/blockchain/statistics - Get blockchain statistics
  if (segments[0] === 'statistics' && method === 'GET') {
    try {
      const stats = blockchain.getStatistics();
      return NextResponse.json({ statistics: stats });
    } catch (error) {
      console.error('Error getting blockchain statistics:', error);
      return NextResponse.json(
        { error: 'Failed to get statistics' },
        { status: 500 }
      );
    }
  }

  // GET /api/blockchain/history/:nip - Get ASN history from blockchain
  if (segments[0] === 'history' && segments[1] && method === 'GET') {
    try {
      const nip = segments[1];
      const history = blockchain.getASNHistory(nip);
      return NextResponse.json({ nip, history });
    } catch (error) {
      console.error('Error getting ASN history:', error);
      return NextResponse.json(
        { error: 'Failed to get history' },
        { status: 500 }
      );
    }
  }

  // GET /api/blockchain/merit-audit/:nip - Get merit audit trail
  if (segments[0] === 'merit-audit' && segments[1] && method === 'GET') {
    try {
      const nip = segments[1];
      const audit = blockchain.getMeritAuditTrail(nip);
      return NextResponse.json({ audit });
    } catch (error) {
      console.error('Error getting merit audit:', error);
      return NextResponse.json(
        { error: 'Failed to get audit trail' },
        { status: 500 }
      );
    }
  }

  // POST /api/blockchain/verify - Verify credential
  if (segments[0] === 'verify' && method === 'POST') {
    try {
      const { nip, credentialHash } = await request.json();
      const verification = blockchain.verifyCredential(nip, credentialHash);
      return NextResponse.json({ verification });
    } catch (error) {
      console.error('Error verifying credential:', error);
      return NextResponse.json(
        { error: 'Failed to verify credential' },
        { status: 500 }
      );
    }
  }

  // GET /api/blockchain/export/:nip - Export audit trail
  if (segments[0] === 'export' && segments[1] && method === 'GET') {
    try {
      const nip = segments[1];
      const audit = blockchain.getMeritAuditTrail(nip);
      const exportData = {
        nip,
        exportDate: new Date().toISOString(),
        audit,
        blockchainExport: blockchain.exportBlockchain()
      };
      return NextResponse.json(exportData);
    } catch (error) {
      console.error('Error exporting audit:', error);
      return NextResponse.json(
        { error: 'Failed to export audit trail' },
        { status: 500 }
      );
    }
  }

  // POST /api/blockchain/add-credential - Add credential to blockchain
  if (segments[0] === 'add-credential' && method === 'POST') {
    try {
      const credential = await request.json();
      const result = blockchain.addCredential(credential);
      
      // Also save to MongoDB for persistence
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      await db.collection('blockchain_records').insertOne({
        type: 'CREDENTIAL',
        nip: credential.nip,
        blockInfo: result,
        data: credential,
        timestamp: new Date()
      });

      return NextResponse.json({ success: true, blockInfo: result });
    } catch (error) {
      console.error('Error adding credential:', error);
      return NextResponse.json(
        { error: 'Failed to add credential' },
        { status: 500 }
      );
    }
  }

  // POST /api/blockchain/add-performance - Add performance record
  if (segments[0] === 'add-performance' && method === 'POST') {
    try {
      const performance = await request.json();
      const result = blockchain.addPerformanceRecord(performance);
      
      // Save to MongoDB
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      await db.collection('blockchain_records').insertOne({
        type: 'PERFORMANCE',
        nip: performance.nip,
        blockInfo: result,
        data: performance,
        timestamp: new Date()
      });

      return NextResponse.json({ success: true, blockInfo: result });
    } catch (error) {
      console.error('Error adding performance:', error);
      return NextResponse.json(
        { error: 'Failed to add performance record' },
        { status: 500 }
      );
    }
  }

  // POST /api/blockchain/add-career - Add career movement
  if (segments[0] === 'add-career' && method === 'POST') {
    try {
      const career = await request.json();
      const result = blockchain.addCareerMovement(career);
      
      // Save to MongoDB
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      await db.collection('blockchain_records').insertOne({
        type: 'CAREER_MOVEMENT',
        nip: career.nip,
        blockInfo: result,
        data: career,
        timestamp: new Date()
      });

      return NextResponse.json({ success: true, blockInfo: result });
    } catch (error) {
      console.error('Error adding career movement:', error);
      return NextResponse.json(
        { error: 'Failed to add career movement' },
        { status: 500 }
      );
    }
  }

  // POST /api/blockchain/add-assessment - Add talent assessment
  if (segments[0] === 'add-assessment' && method === 'POST') {
    try {
      const assessment = await request.json();
      const result = blockchain.addTalentAssessment(assessment);
      
      // Save to MongoDB
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      await db.collection('blockchain_records').insertOne({
        type: 'TALENT_ASSESSMENT',
        nip: assessment.nip,
        blockInfo: result,
        data: assessment,
        timestamp: new Date()
      });

      return NextResponse.json({ success: true, blockInfo: result });
    } catch (error) {
      console.error('Error adding assessment:', error);
      return NextResponse.json(
        { error: 'Failed to add talent assessment' },
        { status: 500 }
      );
    }
  }

  // POST /api/blockchain/seed - Seed blockchain with sample data (Admin only)
  if (segments[0] === 'seed' && method === 'POST') {
    try {
      if (user.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
      }

      const stats = seedBlockchainData();
      
      // Save blockchain state to MongoDB
      const client = await clientPromise;
      const db = client.db(process.env.MONGO_DB_NAME || 'text-spacing');
      await db.collection('blockchain_seeds').insertOne({
        stats,
        seededBy: user.id,
        seededAt: new Date()
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Blockchain seeded successfully',
        stats 
      });
    } catch (error) {
      console.error('Error seeding blockchain:', error);
      return NextResponse.json(
        { error: 'Failed to seed blockchain' },
        { status: 500 }
      );
    }
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
  
  if (segments[0] === 'merit') {
    return handleMeritSystem(segments.slice(1), request, 'GET');
  }
  
  if (segments[0] === 'mock-bkn') {
    return handleMockBKN(segments.slice(1), request, 'GET');
  }
  
  if (segments[0] === 'blockchain') {
    return handleBlockchain(segments.slice(1), request, 'GET');
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
  
  if (segments[0] === 'merit') {
    return handleMeritSystem(segments.slice(1), request, 'POST');
  }
  
  if (segments[0] === 'blockchain') {
    return handleBlockchain(segments.slice(1), request, 'POST');
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}