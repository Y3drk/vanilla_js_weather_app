const searchButton = document.getElementById("search_button");
searchButton.addEventListener("click", callAPI, false);

const resetButton = document.getElementById("reset_button");
resetButton.addEventListener("click", resetResults, false);

const baseOutput = "Type the name of the city in the input field, then click SEARCH to get its weather";
const waitingOutput = "Your call is being processed, please wait";

function returnErrorMessage(error){
    return `The API call failed due to ${error} error!`;
}

function callAPI(e) {
    e.preventDefault()

    //1. Set-up waiting for results in display

    //2. Call weather API

    //3. Display results or error

    //4. Clear input field
}


function resetResults(e) {
    e.preventDefault()

    //4. Go back to the base output
}