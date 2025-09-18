import { chromium } from 'playwright';

async function testBackgroundScroll() {
  const browser = await chromium.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  try {
    console.log('Navigating to http://localhost:5173/...');
    await page.goto('http://localhost:5173/', {
      waitUntil: 'networkidle',
      timeout: 10000
    });

    // Wait for content to load
    await page.waitForTimeout(3000);

    // Navigate to history section
    console.log('Scrolling to history section...');
    await page.evaluate(() => {
      window.scrollTo(0, 1200);
    });

    await page.waitForTimeout(2000);

    // Take initial screenshot
    await page.screenshot({
      path: 'background-scroll-initial.png',
      fullPage: false
    });
    console.log('Initial screenshot saved');

    // Test horizontal scrolling and check background text movement
    console.log('Testing horizontal scroll and background text animation...');

    const scrollPositions = [0, 0.25, 0.5, 0.75, 1.0];

    for (let i = 0; i < scrollPositions.length; i++) {
      const scrollFraction = scrollPositions[i];

      // Scroll horizontally
      await page.evaluate((fraction) => {
        const scrollArea = document.querySelector('[style*="scrollbar-width: none"]');
        if (scrollArea) {
          const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth;
          scrollArea.scrollLeft = maxScroll * fraction;
        }
      }, scrollFraction);

      await page.waitForTimeout(1000);

      // Check background text position
      const backgroundInfo = await page.evaluate(() => {
        const backgroundText = document.getElementById('scrolling-background-text');
        if (backgroundText) {
          const rect = backgroundText.getBoundingClientRect();
          const transform = window.getComputedStyle(backgroundText).transform;
          return {
            found: true,
            top: rect.top,
            right: rect.right,
            transform: transform,
            visible: rect.top < window.innerHeight && rect.bottom > 0
          };
        }
        return { found: false };
      });

      console.log(`Scroll position ${Math.round(scrollFraction * 100)}%:`);
      console.log(`  Background text found: ${backgroundInfo.found}`);
      if (backgroundInfo.found) {
        console.log(`  Position - Top: ${backgroundInfo.top}, Right: ${backgroundInfo.right}`);
        console.log(`  Transform: ${backgroundInfo.transform}`);
        console.log(`  Visible: ${backgroundInfo.visible}`);
      }

      // Take screenshot
      await page.screenshot({
        path: `background-scroll-${Math.round(scrollFraction * 100)}percent.png`,
        fullPage: false
      });
    }

    console.log('Background scroll animation test completed!');

  } catch (error) {
    console.error('Error during test:', error.message);
  } finally {
    await browser.close();
  }
}

testBackgroundScroll();