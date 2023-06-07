import {  Page, Route } from '@playwright/test';

import creds from './creds3.json'
const login = creds['login']
const password = creds['password']


export class BookStorePage {
    private page: Page;
  
    constructor(page: Page) {
      this.page = page;
    }

    async blockImagesAndGoToBookStore(): Promise<void>{
      await this.page.route('**/*.{png,jpg,webp,gif,svg,ICO, TIFF, EPS}', (route) =>
        route.abort()
      );
      await this.page.goto('https://demoqa.com/books');
    }
    // await this.page.goto('https://demoqa.com/books');

    async waitForResponse(){
      await this.page.waitForResponse('https://demoqa.com/BookStore/v1/Books');
    }
  }
