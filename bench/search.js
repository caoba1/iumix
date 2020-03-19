/* Code from https://www.codexpedia.com/api/youtube-search-api-example-with-javascript-and-html/ */

// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
    gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
    console.log("Success1");
}
// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
    gapi.client.init({
      apiKey: 'AIzaSyDn4eBLCP-WKdF5WZK3auTyfX-N5uIev6k'
    });
    //setApiKey('AIzaSyDn4eBLCP-WKdF5WZK3auTyfX-N5uIev6k');
    console.log("Success2");
}

// Called when the search button is clicked in the html code
function searchF() {
    var query = document.getElementById('query').value;
    // Use the JavaScript client library to create a search.list() API call.
    var request = gapi.client.youtube.search.list('id,snippet', {q: query, maxResults: 25});
    // Send the request to the API server, call the onSearchResponse function when the data is returned
    request.execute(onSearchResponse);

}
// Triggered by this line: request.execute(onSearchResponse);
function onSearchResponse(response) {
    var responseString = JSON.stringify(response, '', 2);
    document.getElementById('response').innerHTML = responseString;
}

//1.Load client
//onClientLoad();
//onYouTubeApiLoad();
