const { chromium } = require('playwright-core');
const path = require('path');
const fs = require('fs');

async function capture() {
  const outputDir = path.resolve(__dirname, '../../docs/screenshots');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Launching browser (msedge)...');
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: true
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const baseUrl = 'https://frontend-nine-alpha-59.vercel.app';

  console.log(`Navigating to ${baseUrl}...`);
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // 0. Landing Page Overview
  console.log('Capturing 00_landing_page.png...');
  await page.screenshot({
    path: path.join(outputDir, '00_landing_page.png'),
    fullPage: false
  });

  // Enter Portal / Dashboard
  console.log('Clicking Launch Enterprise Suite to enter portal...');
  const enterBtn = page.locator('button:has-text("Launch Enterprise Suite")').first();
  await enterBtn.click();
  await page.waitForTimeout(2500);

  // 1. Worker Digital Work Passport (Default View in Portal)
  console.log('Capturing 01_worker_passport.png...');
  await page.screenshot({
    path: path.join(outputDir, '01_worker_passport.png'),
    fullPage: false
  });

  // 2. ShramScore 6-Factor Breakdown
  console.log('Capturing 02_shramscore.png...');
  const scoreTab = page.locator('button:has-text("Reliability Score (ShramScore)")').first();
  if (await scoreTab.isVisible()) {
    await scoreTab.click();
    await page.waitForTimeout(1200);
    await page.screenshot({
      path: path.join(outputDir, '02_shramscore.png'),
      fullPage: false
    });
  }

  // 3. Merkle DAG Tamper Verification
  console.log('Capturing 03_merkle_tamper_verification.png...');
  const ledgerTab = page.locator('button:has-text("Work Ledger")').first();
  if (await ledgerTab.isVisible()) {
    await ledgerTab.click();
    await page.waitForTimeout(1000);

    const tamperHeading = page.locator('text=Interactive Cryptographic Tamper Demonstration').first();
    if (await tamperHeading.isVisible()) {
      await tamperHeading.scrollIntoViewIfNeeded();
      await page.waitForTimeout(600);

      const tamperBtn = page.locator('button:has-text("Simulate Attack")').first();
      if (await tamperBtn.isVisible()) {
        await tamperBtn.click();
        await page.waitForTimeout(500);
      }

      const verifyBtn = page.locator('button:has-text("Verify Cryptographic Integrity")').first();
      if (await verifyBtn.isVisible()) {
        await verifyBtn.click();
        await page.waitForTimeout(1000);
      }
    }
    await page.screenshot({
      path: path.join(outputDir, '03_merkle_tamper_verification.png'),
      fullPage: false
    });
  }

  // Return to Overview / Passport
  const passportTab = page.locator('button:has-text("Work Passport")').first();
  if (await passportTab.isVisible()) {
    await passportTab.click();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
  }

  // 4. Real OCR Document Scanner with OpenCV Previews
  console.log('Capturing 04_ocr_document_scanner.png...');
  const scanBtn = page.locator('button:has-text("Scan Slip"), button:has-text("दस्तावेज़ स्कैन")').first();
  if (await scanBtn.isVisible()) {
    await scanBtn.click();
    await page.waitForTimeout(1000);

    const presetWageBtn = page.locator('button:has-text("Wage Slip (₹850)")').first();
    if (await presetWageBtn.isVisible()) {
      await presetWageBtn.click();
      await page.waitForTimeout(500);
    }

    const runOcrBtn = page.locator('button:has-text("Process Document with Real OCR Pipeline"), button:has-text("Run Real Computer Vision")').first();
    if (await runOcrBtn.isVisible()) {
      await runOcrBtn.click();
      await page.waitForTimeout(2500);
    }

    await page.screenshot({
      path: path.join(outputDir, '04_ocr_document_scanner.png'),
      fullPage: false
    });

    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }

  // 5. Voice Entry Modal
  console.log('Capturing 05_voice_entry.png...');
  const voiceBtn = page.locator('button:has-text("Voice Log"), button:has-text("आवाज़ से दर्ज")').first();
  if (await voiceBtn.isVisible()) {
    await voiceBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(outputDir, '05_voice_entry.png'),
      fullPage: false
    });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }

  // 6. Contractor / EPC Site Management Hub
  console.log('Capturing 06_contractor_dashboard.png...');
  const employerNav = page.locator('button:has-text("Employer / Contractor")').first();
  if (await employerNav.isVisible()) {
    await employerNav.click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(outputDir, '06_contractor_dashboard.png'),
      fullPage: false
    });
  }

  // 7. Bank & NBFC Underwriting Terminal
  console.log('Capturing 07_lender_dashboard.png...');
  const lenderNav = page.locator('button:has-text("Bank / NBFC")').first();
  if (await lenderNav.isVisible()) {
    await lenderNav.click();
    await page.waitForTimeout(1500);
    await page.screenshot({
      path: path.join(outputDir, '07_lender_dashboard.png'),
      fullPage: false
    });
  }

  // 8. 9-Step Guided End-to-End Demo Modal
  console.log('Capturing 08_end_to_end_demo.png...');
  const demoNav = page.locator('button:has-text("End-to-End Demo")').first();
  if (await demoNav.isVisible()) {
    await demoNav.click();
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: path.join(outputDir, '08_end_to_end_demo.png'),
      fullPage: false
    });
  }

  console.log('🎉 ALL SCREENSHOTS CAPTURED SUCCESSFULLY IN docs/screenshots!');
  await browser.close();
}

capture().catch(err => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
