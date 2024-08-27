const { expect } = require("playwright/test")

// creating class login and allowing it to be exported
exports.LoginPage = class LoginPage {

    constructor(page) {
        this.page = page
        this.username_textbox = page.locator('input[name="username"]') // username var
        this.password_textbox = page.locator('input[name="password"]') // pass var
        this.login_button = page.getByRole('button', { name: 'Log In' }) // login button
    }

    // login page
    async gotoLoginPage(){
        await this.page.goto('https://reddit.com');
    }

    // tested reddit page
    async gotoReddit(){
        await this.page.goto('https://www.reddit.com/r/QAGeeks/')
    }

    // login function
    async login(username, password){
        await this.username_textbox.fill(username)
        await this.password_textbox.fill(password)
    }

}