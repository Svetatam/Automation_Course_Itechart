import { expect, Locator, Page } from '@playwright/test';

import creds from './creds3.json'
const login = creds['login']
const password = creds['password']

export class LoginPage {
    
    readonly page: Page;
      
    constructor(page: Page) {
        this.page = page;
    }

    
    async goto() {
        await this.page.goto('https://demoqa.com/login');
      }
      
  async fillCredentials(login, password){
    await this.page.fill('#userName', login);
    await this.page.fill('#password', password);
  }

  async clickLogin(){
    await this.page.click('#login');
  }
}
