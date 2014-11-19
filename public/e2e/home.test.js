describe('home page', function() {

    beforeEach(function() {

        // Load the home page before each test
        browser.get('http://localhost:3000');
    });

    it('should show a welcome message', function () {

        var jumbotron = browser.findElement(by.css('.jumbotron'));

        expect(jumbotron.getText()).toMatch(/Welcome/);
        expect(jumbotron.getText()).toMatch(/to Emotion in Motion/);
    });

    it('should change languages according to the selection in the drop-down menu', function() {

        var jumbotron = browser.findElement(by.css('.jumbotron'));

        expect(jumbotron.getText()).toMatch(/Welcome/);

        var languageDropdown = element(by.cssContainingText('.dropdown', 'Select Language'));
        languageDropdown.click();

        var spanishLink = languageDropdown.element(by.cssContainingText('a', 'Español'));
        spanishLink.click();

        expect(jumbotron.getText()).toMatch(/Bienvenido/);
    });

    it('should advance to the start page on button click', function() {

        element(by.cssContainingText('a', 'Start Experiment')).click();

        expect(browser.getLocationAbsUrl()).toBe('http://localhost:3000/#!/start')
    });
});

describe('start page', function() {
    function loadHomePage() {
        browser.get('http://localhost:3000');
    }

    function selectEnglishLanguage() {
        var languageDropdown = element(by.cssContainingText('.dropdown', 'Select Language'));
        languageDropdown.click();

        var englishLink = languageDropdown.element(by.cssContainingText('a', 'English'));
        englishLink.click();
    }

    function advanceToStartPage() {
        element(by.cssContainingText('a', 'Start Experiment')).click();
    }

    beforeEach(function() {
        loadHomePage();
        selectEnglishLanguage();
        advanceToStartPage();
    });

    it('should load with the continue button disabled', function() {
        var continueButton = element(by.cssContainingText('a', 'Continue'));

        expect(continueButton.getWebElement().getAttribute('disabled')).toBe('true');
    });
});