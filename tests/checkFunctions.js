const { expect } = require("playwright/test")

// creating class login and allowing it to be exported
exports.checkFunc = class checkFunc {
    constructor(page) {
        this.page = page
        this.joinButton = page.getByRole('button', { name: 'Join' }) // join button
        this.freqMenu = page.getByLabel('Notification frequency menu') // the bell icon on reddit
        this.updateDraftButton = page.getByRole('button', { name: 'Update draft' }); // Locate the "Update draft" button
        this.saveDraftButton = page.getByRole('button', { name: 'Save draft' }); // Locate the "Save draft" button
    }

    // function to check if the user is joined or not
    async  checkAndJoin(page) {    

        // Check if the button is visible
        await this.joinButton.isVisible();
    
        // Get the background color of the join button
        const backgroundColor = await this.joinButton.evaluate((button) => {
            return window.getComputedStyle(button).backgroundColor;
        });

        // Check if the background color is the desired one
        if (backgroundColor === 'rgb(0, 69, 172)') {
            await this.joinButton.click();
            console.log("Joined Successfully");
            return true;  // Return true if the join button was clicked
        } else {
            console.log("Already Joined");
            this.joinButton.click()
            await this.page.waitForTimeout(2000);
            this.joinButton.click()
            return false; // Return false if the background color did not match (the state is joined)
        }
    }

    // function to confirm that the join was successful
    async checkNotificationFrequencyButton(page) {
    
        // Check if the button is visible
        const isNotificationButtonVisible = await this.freqMenu.isVisible();
    
        if (isNotificationButtonVisible) {
            console.log("Notification frequency menu button is visible (Joined Already)");
        } else {
            console.log("Notification frequency menu button is not visible (Not Joined)");
        }
    
        return isNotificationButtonVisible; // Return true if visible, false otherwise
    }
    
    // function to check if the draft post was saved successfully
    async checkDraftButtons(page) {
    
        // Check if "Update draft" button is visible and "Save draft" button is hidden
        const isUpdateDraftVisible = await this.updateDraftButton.isVisible();
        const isSaveDraftHidden = await this.saveDraftButton.isHidden();
    
        if (isUpdateDraftVisible && isSaveDraftHidden) {
            console.log("The 'Update draft' button is visible, and the 'Save draft' button has disappeared (Draft Post Saved successfully)");
            return true;
        } else {
            console.log("The condition is not met: either the 'Update draft' button is not visible, or the 'Save draft' button is still present (Draft post is not saved)");
            return false;
        }
    }
    
    

}