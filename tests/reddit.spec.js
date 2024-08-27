const { test, expect } = require('@playwright/test');
import { LoginPage } from './login' // import login class
import { checkFunc } from './checkFunctions' // import checking function to check join and draft post

// Without setting the user agent manually reddit will block the requests.
test.use({ userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' });

test.describe("Reddit Testing", () => {

  // run before each workflow
  test.beforeEach(async ({ page }) => {

    // take object from loginpage
    const Login = new LoginPage(page)

    //go to reddit login page 
    await Login.gotoLoginPage()

    //press on login button
    await page.getByRole('link', { name: 'Log In' }).click();

    
    // enter ur name and pass
    await Login.login('locilo8756@daypey.com', 'test123456@')
    await expect(Login.login_button).toBeVisible()
    await Login.login_button.click()
    await expect(Login.login_button).toBeDisabled()
    await page.waitForTimeout(2000);

    // go to reddit website
    await Login.gotoReddit()
    await page.waitForTimeout(2000);
  })


  test('Work flow 1', async ({ page }, testInfo) => {
    // take object from checkFuntions
    const checkFunction = new checkFunc(page)

    // variable to store the return of function checkAndJoin
    const didJoin = await checkFunction.checkAndJoin(page);
    
    await page.waitForTimeout(2000);
    if (didJoin) {
      console.log('User just joined the subreddit.');
    } else {
      console.log('User was already joined.');
    }

    // check if Join is successful
    const isButtonVisible = await checkFunction.checkNotificationFrequencyButton(page);
    if (isButtonVisible) {
      console.log('Joined Successfully');
    } else {
      console.log('There is an error when joining this reddit');
    }
  });

  
  test('Work flow 2', async ({ page }) => {
    // take object from checkFuntions
    const checkFunction = new checkFunc(page)

    // Request to post
    if (await page.getByText('Request to Post').isVisible()) {
      await page.getByText('Request to Post').click();
      await page.getByLabel('*').click();
      await page.getByLabel('*').fill('test');
      await page.getByRole('button', { name: 'Send Request' }).click();
      await page.locator('//*[@id="protected-community-modal"]/div/button').click();
      console.log('request done')
      await page.waitForTimeout(2000);
      await page.goto('https://reddit.com/r/QAGeeks/');
    }
    await page.waitForTimeout(3000);

    // click on draft post to create a post
    await page.getByText('Draft Post').click();

    // click and fill the title of the post
    await page.getByRole('textbox', { name: 'Title *' }).click();
    await page.getByRole('textbox', { name: 'Title *' }).fill('test');

    // click and fill the body of the post
    await page.getByRole('paragraph').click();
    await page.getByRole('textbox', { name: 'Post body text field' }).fill('this is a test');

    // click on save draft to save the post to the draft
    await page.getByRole('button', { name: 'Save draft' }).click();
    await page.waitForTimeout(2000);

    // to check if the draft is saved successfully
    const draftButtonsStatus = await checkFunction.checkDraftButtons(page);

    if (draftButtonsStatus) {
      console.log('Draft post is saved successfully');
    } else {
      console.log('Draft post is not saved successfully');
    }
  });
})

const { exec } = require('child_process');
const fs = require('fs');

const url = 'https://www.reddit.com'; // Change this if needed
const threshold = 80; // Performance score threshold

exec(`lighthouse ${url} --output json --output-path ./report.json`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing Lighthouse: ${error}`);
    return;
  }

  const report = JSON.parse(fs.readFileSync('./report.json', 'utf8'));
  const performanceScore = report.categories.performance.score * 100;

  if (performanceScore < threshold) {
    console.error(`Performance score ${performanceScore} is below the threshold of ${threshold}`);
    process.exit(1); // Indicate failure
  } else {
    console.log(`Performance score ${performanceScore} is above the threshold of ${threshold}`);
  }
});
