import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testWebsite() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  try {
    console.log('🚀 Starting website testing...');
    
    // Navigate to the website
    console.log('📍 Navigating to http://localhost:5000/');
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000); // Wait for animations/loading
    
    // Create screenshots directory
    const screenshotDir = path.join(__dirname, 'test-screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir);
    }

    // Test results object
    const testResults = {
      rental: { issues: [] },
      commercial: { issues: [] },
      meetTheTeam: { issues: [] },
      contactUs: { issues: [] },
      navigation: { issues: [] }
    };

    // 1. TEST RENTAL SECTION
    console.log('\n📋 Testing Rental Section...');
    
    // Try to find rental section
    const rentalSection = await page.locator('[data-section="rental"], #rental, section:has-text("rental"), .rental-section').first();
    
    if (await rentalSection.count() > 0) {
      await rentalSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Check for text content
      const rentalText = await rentalSection.textContent();
      console.log('Rental section text length:', rentalText?.length || 0);
      
      if (!rentalText || rentalText.trim().length < 10) {
        testResults.rental.issues.push('Rental section has very little or no text content');
      }
      
      // Check for "go to" button
      const goToButton = await rentalSection.locator('button:has-text("go to"), a:has-text("go to"), [class*="button"]:has-text("go to")').count();
      if (goToButton === 0) {
        testResults.rental.issues.push('Rental section missing "go to" button');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: path.join(screenshotDir, 'rental-section.png'),
        fullPage: false
      });
      
    } else {
      testResults.rental.issues.push('Rental section not found on page');
    }

    // 2. TEST COMMERCIAL SECTION
    console.log('\n📋 Testing Commercial Section...');
    
    const commercialSection = await page.locator('[data-section="commercial"], #commercial, section:has-text("commercial"), .commercial-section').first();
    
    if (await commercialSection.count() > 0) {
      await commercialSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Check for text content
      const commercialText = await commercialSection.textContent();
      console.log('Commercial section text length:', commercialText?.length || 0);
      
      if (!commercialText || commercialText.trim().length < 10) {
        testResults.commercial.issues.push('Commercial section has very little or no text content');
      }
      
      // Check for "go to" button
      const goToButton = await commercialSection.locator('button:has-text("go to"), a:has-text("go to"), [class*="button"]:has-text("go to")').count();
      if (goToButton === 0) {
        testResults.commercial.issues.push('Commercial section missing "go to" button');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: path.join(screenshotDir, 'commercial-section.png'),
        fullPage: false
      });
      
    } else {
      testResults.commercial.issues.push('Commercial section not found on page');
    }

    // 3. TEST MEET THE TEAM PAGE/SECTION
    console.log('\n📋 Testing Meet the Team Section...');
    
    // Try to find team section or navigate to team page
    let teamSection = await page.locator('[data-section="team"], #team, section:has-text("team"), .team-section, section:has-text("meet")').first();
    
    if (await teamSection.count() === 0) {
      // Try to find a navigation link to team page
      const teamLink = await page.locator('a:has-text("team"), a:has-text("meet"), nav a[href*="team"]').first();
      if (await teamLink.count() > 0) {
        console.log('Found team navigation link, clicking...');
        await teamLink.click();
        await page.waitForTimeout(2000);
        teamSection = await page.locator('main, body, .container').first();
      }
    }
    
    if (await teamSection.count() > 0) {
      await teamSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Check for text content
      const teamText = await teamSection.textContent();
      console.log('Team section text length:', teamText?.length || 0);
      
      if (!teamText || teamText.trim().length < 50) {
        testResults.meetTheTeam.issues.push('Meet the Team section has very little or no text content');
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: path.join(screenshotDir, 'team-section.png'),
        fullPage: false
      });
      
    } else {
      testResults.meetTheTeam.issues.push('Meet the Team section not found');
    }

    // Navigate back to main page for contact testing
    await page.goto('http://localhost:5000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // 4. TEST CONTACT US SECTION
    console.log('\n📋 Testing Contact Us Section...');
    
    const contactSection = await page.locator('[data-section="contact"], #contact, section:has-text("contact"), .contact-section').first();
    
    if (await contactSection.count() > 0) {
      // Get initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Scroll to contact section
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      
      // Get contact section position
      const contactBounds = await contactSection.boundingBox();
      const currentScrollY = await page.evaluate(() => window.scrollY);
      
      console.log(`Initial scroll: ${initialScrollY}, After scroll: ${currentScrollY}`);
      console.log(`Contact section top: ${contactBounds?.y || 'unknown'}`);
      
      // Check if section is properly positioned at top
      if (contactBounds && contactBounds.y > 100) {
        testResults.contactUs.issues.push(`Contact section not properly positioned at top (${contactBounds.y}px from top)`);
      }
      
      // Take screenshot
      await page.screenshot({ 
        path: path.join(screenshotDir, 'contact-section.png'),
        fullPage: false
      });
      
    } else {
      testResults.contactUs.issues.push('Contact Us section not found');
    }

    // 5. TEST NAVIGATION BETWEEN SECTIONS
    console.log('\n📋 Testing Navigation Between Sections...');
    
    // Test navigation links
    const navLinks = await page.locator('nav a, [class*="nav"] a, .menu a').all();
    
    for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
      const link = navLinks[i];
      const href = await link.getAttribute('href');
      const text = await link.textContent();
      
      console.log(`Testing navigation: ${text} (${href})`);
      
      try {
        const initialY = await page.evaluate(() => window.scrollY);
        await link.click();
        await page.waitForTimeout(1500);
        const finalY = await page.evaluate(() => window.scrollY);
        
        console.log(`Scroll change: ${initialY} → ${finalY}`);
        
        if (Math.abs(finalY - initialY) < 50 && href && href.includes('#')) {
          testResults.navigation.issues.push(`Navigation to ${text} (${href}) did not scroll properly`);
        }
      } catch (error) {
        testResults.navigation.issues.push(`Navigation link ${text} failed: ${error.message}`);
      }
    }

    // Final full page screenshot
    await page.screenshot({ 
      path: path.join(screenshotDir, 'full-page.png'),
      fullPage: true
    });

    // REPORT RESULTS
    console.log('\n📊 TEST RESULTS SUMMARY:');
    console.log('========================');
    
    Object.entries(testResults).forEach(([section, data]) => {
      console.log(`\n${section.toUpperCase()}:`);
      if (data.issues.length === 0) {
        console.log('  ✅ No issues found');
      } else {
        data.issues.forEach(issue => console.log(`  ❌ ${issue}`));
      }
    });

    console.log(`\n📸 Screenshots saved to: ${screenshotDir}`);

    return testResults;

  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ 
      path: path.join(__dirname, 'error-screenshot.png'),
      fullPage: true
    });
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the tests
testWebsite().catch(console.error);