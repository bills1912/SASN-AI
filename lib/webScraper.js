import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Web scraper for government institution websites
 * Scrapes employee data from public government websites
 */

export class GovernmentWebScraper {
  constructor() {
    this.timeout = 30000;
    this.retryAttempts = 3;
    this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
  }

  /**
   * Fetch HTML content from URL with retry logic
   */
  async fetchPage(url) {
    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await axios.get(url, {
          timeout: this.timeout,
          headers: {
            'User-Agent': this.userAgent
          }
        });
        return response.data;
      } catch (error) {
        console.warn(`Attempt ${attempt + 1} failed for ${url}:`, error.message);
        if (attempt < this.retryAttempts - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        } else {
          throw error;
        }
      }
    }
  }

  /**
   * Parse employee data from HTML content
   * Adapts to different website structures
   */
  parseEmployeeData(html, sourceUrl) {
    const $ = cheerio.load(html);
    const employees = [];

    // Try multiple selectors for different website structures
    const selectors = [
      { 
        row: 'tr.employee-row, tr.pegawai, tr.data-row',
        name: 'td.name, td.nama, td:nth-child(1)',
        position: 'td.position, td.jabatan, td:nth-child(2)',
        department: 'td.department, td.unit, td:nth-child(3)',
        education: 'td.education, td.pendidikan, td:nth-child(4)',
        tenure: 'td.tenure, td.masa-kerja, td:nth-child(5)'
      },
      {
        row: '.employee-item, .pegawai-item, .staff-item',
        name: '.employee-name, .nama-pegawai, h3',
        position: '.employee-position, .jabatan, .position',
        department: '.employee-department, .unit-kerja, .department',
        education: '.employee-education, .pendidikan, .education',
        tenure: '.employee-tenure, .masa-kerja, .tenure'
      }
    ];

    for (const selector of selectors) {
      const rows = $(selector.row);
      if (rows.length > 0) {
        rows.each((index, element) => {
          try {
            const $row = $(element);
            
            const name = $row.find(selector.name).first().text().trim();
            const position = $row.find(selector.position).first().text().trim();
            const department = $row.find(selector.department).first().text().trim();
            const education = $row.find(selector.education).first().text().trim();
            const tenureText = $row.find(selector.tenure).first().text().trim();

            if (name && department) {
              employees.push({
                name,
                position: position || 'N/A',
                department,
                education: education || 'N/A',
                tenure_years: this.parseTenure(tenureText),
                source_url: sourceUrl,
                scraped_at: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error('Error parsing employee row:', error.message);
          }
        });
        
        if (employees.length > 0) break; // Found data with this selector
      }
    }

    return employees;
  }

  /**
   * Extract tenure in years from various text formats
   */
  parseTenure(tenureStr) {
    if (!tenureStr) return 0;
    
    // Look for number patterns
    const yearMatch = tenureStr.match(/(\d+)\s*(tahun|year|yr)/i);
    if (yearMatch) {
      return parseInt(yearMatch[1]);
    }

    const numberMatch = tenureStr.match(/\d+/);
    if (numberMatch) {
      return parseInt(numberMatch[0]);
    }

    return 0;
  }

  /**
   * Extract institution metadata from website
   */
  async extractInstitutionMetadata(html, url) {
    const $ = cheerio.load(html);
    
    // Extract institution name
    const institutionName = $('h1.institution-name, .site-title, h1').first().text().trim()
      || new URL(url).hostname.replace('www.', '').split('.')[0];

    // Count total employees
    const employeeCount = $('tr.employee-row, .employee-item, .pegawai').length;

    // Extract additional metadata
    const metadata = {
      name: institutionName,
      url: url,
      employee_count: employeeCount,
      last_scraped: new Date().toISOString(),
      website_type: this.determineWebsiteType($),
    };

    return metadata;
  }

  /**
   * Determine the type/category of government website
   */
  determineWebsiteType($) {
    const bodyText = $('body').text().toLowerCase();
    
    if (bodyText.includes('kementerian') || bodyText.includes('ministry')) {
      return 'ministry';
    } else if (bodyText.includes('dinas') || bodyText.includes('department')) {
      return 'department';
    } else if (bodyText.includes('badan') || bodyText.includes('agency')) {
      return 'agency';
    } else if (bodyText.includes('lembaga') || bodyText.includes('institution')) {
      return 'institution';
    }
    
    return 'government';
  }

  /**
   * Main scraping function for a single institution
   */
  async scrapeInstitution(url) {
    try {
      console.log(`Scraping institution: ${url}`);
      
      const html = await this.fetchPage(url);
      const employees = this.parseEmployeeData(html, url);
      const metadata = await this.extractInstitutionMetadata(html, url);

      // Rate limiting - wait before next request
      await new Promise(resolve => setTimeout(resolve, 2000));

      return {
        success: true,
        institution: metadata,
        employees: employees,
        scraped_count: employees.length
      };
    } catch (error) {
      console.error(`Error scraping ${url}:`, error.message);
      return {
        success: false,
        institution: { url, error: error.message },
        employees: [],
        scraped_count: 0
      };
    }
  }

  /**
   * Scrape multiple institutions
   */
  async scrapeMultipleInstitutions(urls) {
    const results = [];
    
    for (const url of urls) {
      const result = await this.scrapeInstitution(url);
      results.push(result);
    }

    return {
      total_institutions: urls.length,
      successful_scrapes: results.filter(r => r.success).length,
      total_employees: results.reduce((sum, r) => sum + r.scraped_count, 0),
      results: results
    };
  }
}

export default GovernmentWebScraper;
