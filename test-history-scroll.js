import { chromium } from 'playwright';

async function testHistoryScroll() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    console.log('🔍 TESTING HISTORY SECTION SCROLLING\n');

    await page.goto('http://localhost:5000', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // Test scrolling to history section
    console.log('📍 Scrolling to history section...');
    await page.evaluate(() => {
      window.scrollTo(0, window.innerHeight * 1.5); // Should be in history section
    });

    await page.waitForTimeout(2000);

    // Check history section visibility and scroll state
    const historyInfo = await page.evaluate(() => {
      const historySection = document.querySelector('[ref="historyRef"]') ||
                           document.querySelector('section:has([ref="horizontalScrollRef"])') ||
                           document.querySelector('section[style*="zIndex: 20"]');

      const horizontalScrollContainer = document.querySelector('[ref="horizontalScrollRef"]') ||
                                      document.querySelector('.horizontal-scroll') ||
                                      document.querySelector('[style*="overflow-x"]');

      return {
        historySection: {
          found: !!historySection,
          visible: historySection ? historySection.offsetHeight > 0 : false,
          zIndex: historySection ? window.getComputedStyle(historySection).zIndex : null,
          transform: historySection ? window.getComputedStyle(historySection).transform : null
        },
        horizontalScroll: {
          found: !!horizontalScrollContainer,
          scrollLeft: horizontalScrollContainer ? horizontalScrollContainer.scrollLeft : 0,
          scrollWidth: horizontalScrollContainer ? horizontalScrollContainer.scrollWidth : 0,
          clientWidth: horizontalScrollContainer ? horizontalScrollContainer.clientWidth : 0,
          canScroll: horizontalScrollContainer ? horizontalScrollContainer.scrollWidth > horizontalScrollContainer.clientWidth : false
        },
        currentScroll: window.scrollY,
        windowHeight: window.innerHeight
      };
    });

    console.log('History Section Status:');
    console.log(`  Found: ${historyInfo.historySection.found ? '✅' : '❌'}`);
    console.log(`  Visible: ${historyInfo.historySection.visible ? '✅' : '❌'}`);
    console.log(`  Z-Index: ${historyInfo.historySection.zIndex}`);
    console.log(`  Transform: ${historyInfo.historySection.transform}`);

    console.log('\nHorizontal Scroll Container:');
    console.log(`  Found: ${historyInfo.horizontalScroll.found ? '✅' : '❌'}`);
    console.log(`  Can Scroll: ${historyInfo.horizontalScroll.canScroll ? '✅' : '❌'}`);
    console.log(`  Scroll Position: ${historyInfo.horizontalScroll.scrollLeft}px`);
    console.log(`  Scroll Width: ${historyInfo.horizontalScroll.scrollWidth}px`);
    console.log(`  Client Width: ${historyInfo.horizontalScroll.clientWidth}px`);

    console.log('\nPage Scroll:');
    console.log(`  Current Y: ${historyInfo.currentScroll}px`);
    console.log(`  Window Height: ${historyInfo.windowHeight}px`);

    // Test horizontal scrolling within the history section
    if (historyInfo.horizontalScroll.found && historyInfo.horizontalScroll.canScroll) {
      console.log('\n🖱️ Testing horizontal scroll...');

      // Try to scroll horizontally within the container
      await page.evaluate(() => {
        const container = document.querySelector('[ref="horizontalScrollRef"]') ||
                         document.querySelector('.horizontal-scroll') ||
                         document.querySelector('[style*="overflow-x"]');
        if (container) {
          container.scrollLeft = 200;
        }
      });

      await page.waitForTimeout(1000);

      const afterScroll = await page.evaluate(() => {
        const container = document.querySelector('[ref="horizontalScrollRef"]') ||
                         document.querySelector('.horizontal-scroll') ||
                         document.querySelector('[style*="overflow-x"]');
        return container ? container.scrollLeft : 0;
      });

      console.log(`  Horizontal scroll after test: ${afterScroll}px ${afterScroll > 0 ? '✅' : '❌'}`);
    }

    // Test overall vertical scrolling through the section
    console.log('\n📜 Testing vertical scroll progression...');
    for (let i = 1; i <= 5; i++) {
      const scrollY = window.innerHeight * i;
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      await page.waitForTimeout(500);

      const sectionState = await page.evaluate(() => {
        const historySection = document.querySelector('section[style*="zIndex: 20"]');
        return {
          scrollY: window.scrollY,
          sectionTransform: historySection ? window.getComputedStyle(historySection).transform : null,
          sectionVisible: historySection ? historySection.offsetHeight > 0 : false
        };
      });

      console.log(`  Scroll ${i}: Y=${sectionState.scrollY}px, Transform=${sectionState.sectionTransform}, Visible=${sectionState.sectionVisible ? '✅' : '❌'}`);
    }

    // Take screenshot
    await page.screenshot({
      path: 'history-scroll-test.png',
      fullPage: false
    });

    console.log('\n📸 Screenshot saved: history-scroll-test.png');
    console.log('✅ History section scroll testing completed!');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
  }

  await browser.close();
}

testHistoryScroll().catch(console.error);