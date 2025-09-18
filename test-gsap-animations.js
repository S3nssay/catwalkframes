import { chromium } from 'playwright';

async function testGSAPAnimations() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🎭 TESTING GSAP ANIMATIONS IN CONTACT SECTION\n');

    await page.goto('http://localhost:5000', { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(3000);

    // Wait for GSAP to load
    await page.waitForFunction(() => window.gsap !== undefined, { timeout: 10000 });
    console.log('✅ GSAP library loaded successfully');

    // Wait for ScrollTrigger to load
    await page.waitForFunction(() => window.ScrollTrigger !== undefined, { timeout: 5000 });
    console.log('✅ ScrollTrigger plugin loaded successfully');

    // Navigate to contact section
    console.log('\n🎯 Scrolling to contact section...');
    await page.evaluate(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });

    await page.waitForTimeout(4000);

    // Test animation elements
    const animationResults = await page.evaluate(() => {
      const contactSection = document.getElementById('contact');
      if (!contactSection) return { error: 'Contact section not found' };

      // Find animated elements with specific selectors based on our component
      const results = {
        section: {
          found: !!contactSection,
          className: contactSection.className,
          visible: contactSection.offsetHeight > 0
        },
        title: {
          found: false,
          text: '',
          styles: {}
        },
        subtitle: {
          found: false,
          text: '',
          styles: {}
        },
        contactItems: [],
        whatsapp: {
          found: false,
          href: '',
          text: ''
        },
        workingHours: {
          found: false,
          text: ''
        },
        animations: {
          gsapTimelines: window.gsap ? window.gsap.getTweensOf('*').length : 0,
          scrollTriggers: window.ScrollTrigger ? window.ScrollTrigger.getAll().length : 0
        }
      };

      // Find title (h2 with specific text)
      const titleElement = contactSection.querySelector('h2');
      if (titleElement) {
        const computedStyle = window.getComputedStyle(titleElement);
        results.title = {
          found: true,
          text: titleElement.textContent,
          styles: {
            opacity: computedStyle.opacity,
            transform: computedStyle.transform,
            fontSize: computedStyle.fontSize
          }
        };
      }

      // Find subtitle (p element)
      const subtitleElement = contactSection.querySelector('p');
      if (subtitleElement) {
        const computedStyle = window.getComputedStyle(subtitleElement);
        results.subtitle = {
          found: true,
          text: subtitleElement.textContent,
          styles: {
            opacity: computedStyle.opacity,
            transform: computedStyle.transform
          }
        };
      }

      // Find contact items (phone, email, location)
      const contactDivs = contactSection.querySelectorAll('div[class*="text-center"]');
      contactDivs.forEach((div, index) => {
        const icon = div.querySelector('svg');
        const heading = div.querySelector('h3');
        const content = div.querySelector('p');

        if (icon && heading && content) {
          const computedStyle = window.getComputedStyle(div);
          results.contactItems.push({
            index,
            type: heading.textContent,
            content: content.textContent,
            styles: {
              opacity: computedStyle.opacity,
              transform: computedStyle.transform
            }
          });
        }
      });

      // Find WhatsApp button
      const whatsappButton = contactSection.querySelector('a[href*="wa.me"]');
      if (whatsappButton) {
        const computedStyle = window.getComputedStyle(whatsappButton);
        results.whatsapp = {
          found: true,
          href: whatsappButton.href,
          text: whatsappButton.textContent,
          styles: {
            opacity: computedStyle.opacity,
            transform: computedStyle.transform
          }
        };
      }

      // Find working hours
      const workingHoursDiv = contactSection.querySelector('div[class*="bg-\\[\\#8B4A9C\\]"]');
      if (workingHoursDiv) {
        const computedStyle = window.getComputedStyle(workingHoursDiv);
        results.workingHours = {
          found: true,
          text: workingHoursDiv.textContent,
          styles: {
            opacity: computedStyle.opacity,
            transform: computedStyle.transform
          }
        };
      }

      return results;
    });

    console.log('\n📊 ANIMATION TEST RESULTS:');
    console.log(`Contact Section: ${animationResults.section.found ? '✅' : '❌'} Found`);
    console.log(`  Visible: ${animationResults.section.visible ? '✅' : '❌'}`);
    console.log(`  Classes: ${animationResults.section.className}`);

    console.log(`\nTitle Element: ${animationResults.title.found ? '✅' : '❌'} Found`);
    if (animationResults.title.found) {
      console.log(`  Text: "${animationResults.title.text}"`);
      console.log(`  Opacity: ${animationResults.title.styles.opacity}`);
      console.log(`  Transform: ${animationResults.title.styles.transform}`);
    }

    console.log(`\nSubtitle Element: ${animationResults.subtitle.found ? '✅' : '❌'} Found`);
    if (animationResults.subtitle.found) {
      console.log(`  Text: "${animationResults.subtitle.text}"`);
      console.log(`  Opacity: ${animationResults.subtitle.styles.opacity}`);
    }

    console.log(`\nContact Items: ${animationResults.contactItems.length} found`);
    animationResults.contactItems.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.type}: Opacity ${item.styles.opacity}`);
    });

    console.log(`\nWhatsApp Button: ${animationResults.whatsapp.found ? '✅' : '❌'} Found`);
    if (animationResults.whatsapp.found) {
      console.log(`  Text: "${animationResults.whatsapp.text}"`);
      console.log(`  Opacity: ${animationResults.whatsapp.styles.opacity}`);
    }

    console.log(`\nWorking Hours: ${animationResults.workingHours.found ? '✅' : '❌'} Found`);
    if (animationResults.workingHours.found) {
      console.log(`  Opacity: ${animationResults.workingHours.styles.opacity}`);
    }

    console.log(`\n🎬 Animation Statistics:`);
    console.log(`  GSAP Tweens: ${animationResults.animations.gsapTimelines}`);
    console.log(`  ScrollTriggers: ${animationResults.animations.scrollTriggers}`);

    // Take final screenshot
    await page.screenshot({
      path: 'gsap-animations-test.png',
      fullPage: false
    });

    console.log('\n📸 Screenshot saved: gsap-animations-test.png');
    console.log('✅ GSAP animation testing completed!');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);

    try {
      await page.screenshot({ path: 'gsap-test-error.png', fullPage: true });
      console.log('📸 Error screenshot saved: gsap-test-error.png');
    } catch (screenshotError) {
      console.log('Could not capture error screenshot');
    }
  }

  await browser.close();
}

testGSAPAnimations().catch(console.error);