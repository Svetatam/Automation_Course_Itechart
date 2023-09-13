import { Page } from '@playwright/test'

class NewTrending {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async isAgeVerificationRequired() {
    const ageCheckFrame = await this.page.$('iframe.agegate_iframe')//Эта строка ищет элемент iframe с классом agegate_iframe на текущей странице и сохраняет его в переменной ageCheckFrame. Этот iframe обычно используется для отображения окна верификации возраста
    return !!ageCheckFrame//Метод возвращает true, если был найден iframe, что означает, что верификация возраста требуется, и false, если iframe не был найден.
  }

  async completeAgeVerification() {//Это объявление метода completeAgeVerification(), который выполняет завершение процесса верификации возраста, если он требуется.
    if (await this.isAgeVerificationRequired()) {
      //Этот блок if вызывает метод isAgeVerificationRequired() для проверки, 
      //требуется ли верификация возраста. Если метод вернет true, то процесс будет продолжен.

      await this.page.waitForLoadState('domcontentloaded')
      //Эта строка ожидает, пока состояние загрузки страницы 
      //достигнет domcontentloaded. Это обеспечивает, что страница загрузилась и можно начинать взаимодействие с элементами на ней.

      const ageCheckFrame = await this.page.$('iframe.agegate_iframe')//Снова ищет iframe с классом agegate_iframe, теперь после загрузки страницы.
      if (ageCheckFrame) {//Проверяет, был ли найден iframe после загрузки страницы.
        const ageYearSelector = 'select#ageYear'//Создает селектор для элемента выбора года внутри iframe.
        await ageCheckFrame.fill(ageYearSelector, '1980')//Заполняет поле выбора года в iframe значением '1980'. Это, вероятно, представляет собой ввод даты рождения.
        await this.page.click('#view_product_page_btn')//Кликает на элемент 
        await this.page.waitForNavigation()//Ожидает завершения навигации на новой странице. Это может произойти после успешной верификации возраста.
      }
    }
  }
}

export { NewTrending }
