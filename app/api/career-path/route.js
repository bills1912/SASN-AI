import { NextResponse } from 'next/server';
import { getASNProfile } from '@/lib/mockBKNData';

export async function POST(request) {
  try {
    console.log('🛤️ Career Path API endpoint hit');
    
    const body = await request.json();
    const { nip } = body;
    
    console.log('NIP received:', nip);
    
    if (!nip) {
      console.log('❌ NIP is missing');
      return NextResponse.json({ error: 'NIP is required' }, { status: 400 });
    }
    
    // Get ASN profile
    const profile = getASNProfile(nip);
    
    if (!profile) {
      console.log('❌ Profile not found for NIP:', nip);
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }
    
    console.log('✓ Profile found:', profile.name);
    
    // Generate mock career path
    const careerPath = {
      currentPosition: profile.position,
      currentLevel: profile.grade || 'III/c',
      talentBox: 'Core Player',
      stages: [
        {
          id: 1,
          year: 'Year 1-2',
          position: `Senior ${profile.position}`,
          level: 'III/d - IV/a',
          focus: 'Skill Mastery & Leadership',
          description: 'Deepen technical expertise and take on mentoring roles',
          skills: ['Advanced Technical Skills', 'Mentoring', 'Project Management'],
          training: ['Leadership Training', 'Technical Certification'],
          resources: [
            { type: 'Course', name: 'Advanced Leadership', url: 'https://www.coursera.org/leadership' },
            { type: 'Certification', name: 'Project Management Professional', url: 'https://www.pmi.org' }
          ]
        },
        {
          id: 2,
          year: 'Year 3-4',
          position: 'Team Lead / Specialist',
          level: 'IV/a - IV/b',
          focus: 'Team Management & Strategy',
          description: 'Lead small teams and contribute to strategic planning',
          skills: ['Strategic Thinking', 'Team Leadership', 'Stakeholder Management'],
          training: ['Strategic Planning Workshop', 'Change Management'],
          resources: [
            { type: 'Course', name: 'Strategic Management', url: 'https://www.edx.org/strategy' },
            { type: 'Book', name: 'Leaders Eat Last', url: 'https://simonsinek.com' }
          ]
        },
        {
          id: 3,
          year: 'Year 5-7',
          position: 'Manager / Senior Specialist',
          level: 'IV/b - IV/c',
          focus: 'Department Leadership & Innovation',
          description: 'Manage departments and drive innovation initiatives',
          skills: ['Innovation Management', 'Budget Management', 'Cross-functional Leadership'],
          training: ['Executive Leadership Program', 'Innovation Workshop'],
          resources: [
            { type: 'Program', name: 'Executive Leadership', url: 'https://www.leadership.edu' },
            { type: 'Workshop', name: 'Design Thinking', url: 'https://www.ideo.com' }
          ]
        },
        {
          id: 4,
          year: 'Year 8+',
          position: 'Director / Expert',
          level: 'IV/c - IV/e',
          focus: 'Organizational Strategy & Policy',
          description: 'Shape organizational direction and influence policy',
          skills: ['Strategic Leadership', 'Policy Making', 'Organizational Transformation'],
          training: ['Strategic Leadership Certification', 'Policy Analysis'],
          resources: [
            { type: 'Certification', name: 'Strategic Leader', url: 'https://www.strategy.org' },
            { type: 'Course', name: 'Public Policy', url: 'https://www.hks.harvard.edu' }
          ]
        }
      ],
      keyMilestones: [
        'Complete advanced certification within 2 years',
        'Lead at least 3 major projects',
        'Mentor 5+ junior staff members',
        'Publish 2+ thought leadership articles'
      ],
      successMetrics: [
        'Performance rating consistently above 85',
        'Team satisfaction score > 80%',
        'Successfully implemented initiatives',
        'Positive stakeholder feedback'
      ]
    };
    
    console.log('✅ Returning career path data');
    
    return NextResponse.json({
      success: true,
      careerPath,
      message: 'Career path generated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error in career path API:', error);
    return NextResponse.json(
      { error: 'Failed to generate career path', details: error.message },
      { status: 500 }
    );
  }
}
