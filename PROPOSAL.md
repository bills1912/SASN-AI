# ASTA-CITA AI - Sistem Manajemen Talenta & Kinerja ASN

## 📋 Deskripsi Proyek

**ASTA-CITA AI** adalah sistem inovatif berbasis AI yang dirancang untuk BKN Hackathon 2024 dengan tema "AI untuk Pemenuhan Asta Cita". Sistem ini mengintegrasikan teknologi AI (GPT-4o) dengan analisis Deep Learning untuk memberikan solusi komprehensif dalam:

1. **Manajemen Talenta ASN** - Pemetaan talenta berbasis AI menggunakan 9-Box Grid Matrix
2. **Penilaian Kinerja ASN** - Klasifikasi dan analisis kinerja mendalam dengan rekomendasi AI

## 🎯 Fitur Utama

### 1. Sistem Manajemen Talenta

#### a. **Input Data & Analisis Dokumen**
- Upload dan analisis dokumen penilaian kinerja menggunakan AI
- Ekstraksi otomatis skill teknis dan soft skill dari dokumen
- Analisis portfolio (LinkedIn, website pribadi) dengan AI
- Identifikasi achievement, training, dan sertifikasi

#### b. **Pemetaan Talenta (9-Box Grid)**
- **AI-Powered Talent Mapping** dengan 9-Box Matrix
- Analisis Performance (Low/Medium/High) vs Potential (Low/Medium/High)
- Klasifikasi ke dalam kategori talent box:
  - High Performer - High Potential (Star)
  - High Performer
  - High Potential
  - Solid Professional
  - Core Performer

#### c. **Analisis Skill Mendalam**
- Radar chart interaktif untuk visualisasi skill proficiency
- Benchmark skill vs industry standard
- Identifikasi skill gaps dengan prioritas (High/Medium/Low)
- Emerging skills yang dibutuhkan untuk masa depan
- Roadmap pengembangan skill (3-6-12 bulan)

#### d. **Rekomendasi Jabatan**
- AI menganalisis kesesuaian dengan berbagai posisi
- Skor fit percentage untuk setiap posisi
- Justifikasi mengapa cocok untuk posisi tersebut
- Career path progression yang disarankan

#### e. **Area Pengembangan**
- Identifikasi area yang perlu dikembangkan
- Rekomendasi pelatihan spesifik
- Action items yang actionable

### 2. Sistem Penilaian Kinerja

#### a. **Integrasi Multi-Sumber Data**
- Mock BKN API dari berbagai instansi:
  - Kementerian Keuangan (SKI - Sistem Kinerja Individu)
  - Kementerian Pendidikan (PKA - Penilaian Kinerja ASN)
  - Kementerian Dalam Negeri (EKB - Evaluasi Kinerja Berkala)
- Agregasi data dari multiple assessment methods

#### b. **Analisis Kinerja Berbasis AI**
- **Performance Quadrant Classification**
  - High Performance - High Potential
  - High Performance - Low Potential
  - Low Performance - High Potential
  - Low Performance - Low Potential
- Klasifikasi: Excellent / Very Good / Good / Needs Improvement / Poor

#### c. **Deep Performance Analysis**
- **Strengths Analysis**: Area kekuatan dengan evidence
- **Weaknesses Analysis**: Area perbaikan dengan impact assessment
- **Trend Analysis**: Direction (improving/stable/declining)
- **Risk Factors**: Identifikasi risk dengan mitigation strategies

#### d. **Rekomendasi Pengembangan**
- **Technical Recommendations**:
  - Advanced training dan certification
  - Project leadership opportunities
  - Technical skill development
- **Non-Technical Recommendations**:
  - Leadership development programs
  - Executive coaching
  - Seminar nasional dan internasional
  - Research collaboration
  - Networking events

#### e. **Quarterly Development Plan**
- Rencana pengembangan Q1-Q4
- Focus area per quarter
- Specific activities dan deliverables
- Measurable outcomes

#### f. **ASN News & Trends**
- Web scraping (simulated) untuk berita terkini ASN
- Trend analysis untuk rekomendasi yang relevan
- Update best practices dari berbagai sumber

## 🏗️ Arsitektur Teknologi

### Tech Stack

**Frontend:**
- Next.js 14.2.3 (React Framework)
- Tailwind CSS + shadcn/ui (Modern UI Components)
- ECharts + Recharts (Interactive Data Visualization)
- Lucide React (Icons)

**Backend:**
- Next.js API Routes (Server-side APIs)
- Node.js Runtime

**Database:**
- MongoDB (Data storage untuk analyses & mappings)

**AI/ML:**
- OpenAI GPT-4o (via Emergent LLM Key)
- Deep Learning analysis (simulated with intelligent algorithms)
- Pre-trained models for skill classification

**Visualizations:**
- D3.js principles
- ECharts untuk interactive charts:
  - 9-Box Grid scatter plot
  - Radar charts untuk skill analysis
  - Bar charts untuk performance scores
  - Quadrant analysis plots
  - Circular progress indicators

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │  Login UI  │  │ Talent Mgmt  │  │ Performance Review  │ │
│  └────────────┘  └──────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐│
│  │ Auth APIs   │  │ Talent APIs │  │ Performance APIs    ││
│  └─────────────┘  └─────────────┘  └─────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
    ┌──────────────┐ ┌────────────┐ ┌──────────────┐
    │  OpenAI AI   │ │  MongoDB   │ │ Mock BKN API │
    │  (GPT-4o)    │ │  Database  │ │   Gateway    │
    └──────────────┘ └────────────┘ └──────────────┘
```

## 📊 Data Flow & AI Processing

### Talent Management Flow
```
Input → Document/Portfolio Analysis (AI) → Skill Extraction → 
Competency Scoring → 9-Box Mapping → Career Recommendations → 
Development Plan → Storage (MongoDB)
```

### Performance Assessment Flow
```
Mock BKN APIs → Data Aggregation → AI Analysis → 
Classification → Strengths/Weaknesses → Risk Assessment → 
Recommendations → Development Plan → Web Trends Integration → 
Storage (MongoDB)
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- MongoDB
- Yarn package manager

### Installation Steps

1. **Clone & Install Dependencies**
```bash
cd /app
yarn install
```

2. **Environment Variables**
```env
MONGO_URL=mongodb://localhost:27017/asta_cita_ai
EMERGENT_LLM_KEY=your-emergent-key-here
OPENAI_MODEL=gpt-4o
USE_MOCK_MODE=true  # Set to false when using actual AI
```

3. **Start Services**
```bash
# Development
yarn dev

# Production
yarn build
yarn start
```

## 🎮 Usage Guide

### 1. Login
**Demo Credentials:**
- Admin: `admin` / `admin123`
- ASN: `asn001` / `asn123`

### 2. Input Data
- Navigate to "Input Data" menu
- Enter NIP pegawai
- Paste dokumen penilaian kinerja atau URL portfolio
- Click "Analisis" - AI akan memproses data

### 3. Manajemen Talenta
- Select ASN dari dropdown
- Click "Generate Pemetaan Talenta"
- View:
  - 9-Box Grid visualization
  - Talent Box classification
  - Career path recommendations
  - Suitable positions dengan fit score
  - Development areas
  
- Click "Analisis Skill"
- View:
  - Skill radar chart (proficiency vs benchmark)
  - Skill gaps dengan priority
  - Emerging skills yang dibutuhkan
  - Development roadmap 3-12 bulan

### 4. Penilaian Kinerja
- Select ASN dari dropdown
- Click "Analisis Kinerja dengan AI"
- View:
  - Performance quadrant classification
  - Score breakdown charts
  - Strengths & weaknesses analysis
  - Risk factors assessment
  - Technical & non-technical recommendations
  - Quarterly development plan
  - Berita & trend ASN terkini

## 🎨 UI/UX Features

- **Dark/Light Theme Toggle** - Elegant theme switching
- **Responsive Design** - Works on desktop, tablet, mobile
- **Interactive Visualizations** - ECharts dengan hover interactions
- **Modern Design** - Gradient effects, glassmorphism
- **Intuitive Navigation** - Sidebar dengan clear hierarchy
- **Real-time Updates** - Simulated 12-hour data refresh
- **Loading States** - Clear feedback untuk user
- **Toast Notifications** - Success/error feedback

## 📈 Mock Data & Demo Mode

Sistem saat ini berjalan dalam **MOCK MODE** untuk demonstration purposes:

**Mock Data Includes:**
- 3 ASN profiles dengan data lengkap
- Performance data dari 3 agencies
- News & trends dari berbagai sumber
- Intelligent mock AI responses based on actual data

**Mock AI Responses:**
- Menggunakan algoritma intelligent untuk generate realistic responses
- Based on actual profile data (performance score, years of service, skills)
- Calculations untuk performance/potential levels
- Dynamic recommendations berdasarkan profile characteristics

**For Production:**
Set `USE_MOCK_MODE=false` dan provide valid Emergent LLM Key untuk actual OpenAI GPT-4o integration.

## 🔐 Security Features

- **Mock Authentication System** - Single-gate authentication
- **Token-based Authorization** - JWT-like tokens
- **Role-based Access Control** - Admin vs ASN roles
- **Secure API Endpoints** - Authorization required
- **Input Validation** - Prevent injection attacks

## 📊 Database Schema

### Collections

**talent_mappings**
```javascript
{
  nip: String,
  mapping: {
    performance: Object,
    potential: Object,
    quadrant: Object,
    talentBox: String,
    recommendations: Array
  },
  timestamp: Date
}
```

**performance_analyses**
```javascript
{
  nip: String,
  analysis: {
    classification: String,
    strengths: Array,
    weaknesses: Array,
    recommendations: Object
  },
  timestamp: Date
}
```

**talent_analyses**
```javascript
{
  nip: String,
  analysis: {
    technicalSkills: Array,
    softSkills: Array,
    competencyScore: Number
  },
  timestamp: Date
}
```

## 🎯 Key Innovations

1. **AI-Powered 9-Box Grid** - First in Indonesia untuk ASN talent management
2. **Multi-Source Integration** - Agregasi dari berbagai metode penilaian
3. **Deep Learning Classification** - Sophisticated performance categorization
4. **Real-time Trend Analysis** - Web scraping untuk recommendations
5. **Interactive Visualizations** - ECharts untuk data exploration
6. **Comprehensive Development Plans** - Quarterly roadmaps
7. **Intelligent Mock Mode** - Realistic AI responses untuk demo

## 📱 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token

### Talent Management
- `GET /api/talent/profiles` - Get all ASN profiles
- `GET /api/talent/profile/:nip` - Get specific profile
- `POST /api/talent/analyze-document` - Analyze document with AI
- `POST /api/talent/analyze-portfolio` - Analyze portfolio URL
- `POST /api/talent/talent-mapping` - Generate 9-box mapping
- `POST /api/talent/skill-analysis` - Deep skill analysis

### Performance Assessment
- `GET /api/performance/all` - Get all performance data
- `GET /api/performance/by-nip/:nip` - Get performance by NIP
- `POST /api/performance/analyze` - AI performance analysis
- `GET /api/performance/news` - Get ASN news & trends

### Mock BKN APIs
- `GET /api/mock-bkn/kemenkeu/performance`
- `GET /api/mock-bkn/kemendikbud/performance`
- `GET /api/mock-bkn/kemendagri/performance`

## 🏆 Hackathon Alignment

### Tema: "AI untuk Pemenuhan Asta Cita"

**Alignment dengan Asta Cita:**
- **Birokrasi Berkelas Dunia**: AI-powered talent & performance management
- **Pemerataan Pembangunan**: Sistem dapat digunakan nasional
- **SDM Unggul**: Pengembangan talenta ASN sistematis
- **Transformasi Digital**: Full digital dengan AI integration

**Evaluation Criteria:**

✅ **Relevansi (25%)**: Directly addresses ASN talent & performance management challenges

✅ **Inovasi (25%)**: 
- First AI-powered 9-box grid for Indonesian civil service
- Multi-source performance integration
- Real-time trend analysis

✅ **Penerapan Teknologi (25%)**:
- GPT-4o for advanced NLP analysis
- ECharts for interactive visualizations
- Next.js for modern full-stack app
- MongoDB for scalable data storage

✅ **Dampak (25%)**:
- National scalability
- Objective talent assessment
- Data-driven career development
- Improved ASN competency

## 🎬 Demo Scenarios

### Scenario 1: Talent Mapping
1. Login sebagai admin
2. Pilih "Budi Santoso" dari dropdown
3. Click "Generate Pemetaan Talenta"
4. Observe 9-box grid showing High Performer-High Potential
5. Review career recommendations dan development areas

### Scenario 2: Skill Analysis
1. Stay on same profile
2. Click "Analisis Skill"
3. View radar chart comparing proficiency vs benchmark
4. Identify skill gaps (AI/ML, Cloud Computing)
5. Review 12-month development roadmap

### Scenario 3: Performance Analysis
1. Navigate to "Penilaian Kinerja"
2. Select ASN
3. Click "Analisis Kinerja dengan AI"
4. View quadrant classification (Very Good)
5. Review strengths, weaknesses, risk factors
6. Explore technical & non-technical recommendations
7. Check quarterly development plan

## 📝 Future Enhancements

1. **Actual AI Integration** - Production OpenAI GPT-4o
2. **Real BKN API Integration** - Connect to actual BKN systems
3. **Deep Learning Models** - Train custom CNN/RNN for classification
4. **Real Web Scraping** - Automated news aggregation
5. **Mobile App** - Native iOS/Android apps
6. **Advanced Analytics** - Predictive analytics, forecasting
7. **Multi-language** - Indonesian + English
8. **Gamification** - Skill development badges, leaderboards
9. **Automated Reporting** - PDF/Excel export
10. **Integration APIs** - Open APIs for other systems

## 👥 Team & Credits

**Proposal untuk**: BKN Hackathon 2024 - "AI untuk Pemenuhan Asta Cita"

**Technologies Used:**
- Next.js, React, Tailwind CSS, shadcn/ui
- OpenAI GPT-4o (via Emergent LLM Key)
- MongoDB, ECharts, Lucide Icons
- Node.js, JavaScript/TypeScript

## 📄 License

© 2024 - Proposal Hackathon BKN

---

**Note**: Sistem ini adalah prototype untuk hackathon. Untuk production deployment, pastikan:
- Valid Emergent LLM Key atau OpenAI API key
- Production MongoDB instance
- Actual BKN API integration
- Security hardening
- Load testing
- Compliance review
