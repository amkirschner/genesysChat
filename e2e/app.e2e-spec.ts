import { GenesysChatPage } from './app.po';

describe('genesys-chat App', () => {
  let page: GenesysChatPage;

  beforeEach(() => {
    page = new GenesysChatPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
