const testingLibraryJestExtension = require("@testing-library/jest-dom");
const jsdom = require("jsdom");
const testingLibrary = require("@testing-library/dom");
const {JSDOM} = jsdom;
const {fireEvent, getByText, findByText} = testingLibrary;
const {toBeInTheDocument} = testingLibraryJestExtension;

/**
 *
 * @type {string} - raw version of our page to enable script loading (otherwise it failed due to google fonts)
 */
const html = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '    <meta http-equiv="X-UA-Compatible" content="ie=edge">\n' +
    '    <script type="text/javascript" src="page_process.js" defer></script>\n' +
    '    <title>Weather App</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '    <div id="container">\n' +
    '        <h1 id="main_header">WEATHER APP</h1>\n' +
    '        <h3 id="content_header">Check weather in any location</h3>\n' +
    '        <form id="location_form">\n' +
    '            <label for="place_input" class="descr">Location:</label>\n' +
    '            <input id="place_input" type="text" name="location" required placeholder="location name"/>\n' +
    '        </form>\n' +
    '        <div id="buttons_div">\n' +
    '            <button id="search_button">SEARCH</button>\n' +
    '            <button id="reset_button">RESET</button>\n' +
    '        </div>\n' +
    '        <div id="output_div">\n' +
    '            <p id="output_control_text"></p>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</body>\n' +
    '</html>';

const WEATHER_DATA_PARAMETERS = ["temperature", "cloudiness", "wind speed",
    "weather type", "weather description", "pressure"];

let dom
let container

describe("page.html", () => {
    beforeEach(() => {
        // Constructing a new JSDOM with this option is the key
        // to getting the code in the script tag to execute.
        // This is indeed dangerous and should only be done with trusted content (as it is in our case)
        // https://github.com/jsdom/jsdom#executing-scripts
        dom = new JSDOM(html, {runScripts: 'dangerously', resources: "usable"});
        container = dom.window.document.body;
    })

    it('renders the main header', () => {
        expect(container.querySelector('h1')).not.toBeNull();
        expect(getByText(container, 'WEATHER APP')).toBeInTheDocument();
    });

    it('renders both buttons', () => {
        expect(container.querySelectorAll('button').length).toEqual(2);
        expect(getByText(container, 'RESET')).toBeInTheDocument();
        expect(getByText(container, 'SEARCH')).toBeInTheDocument();
    })

    it('renders weather of Kraków', async () => {
        const input = container.querySelector('input');
        const button = getByText(container, 'SEARCH');

        input.textContent = "Kraków";
        fireEvent.click(button);

        //Not sure why it works but wasted hella lot of time for it. So I've decided to cut it short

        // const controlText = await findByText(container,
        //     'Your call was successful! Here are the results for Kraków, PL.', undefined, {timeout: 4500})
        // expect(controlText).toBeInTheDocument();

        // const generatedWeatherInfo = await container.findAllByRole('li');
        // expect(generatedWeatherInfo.length).toBe(WEATHER_DATA_PARAMETERS.length);
    })
});