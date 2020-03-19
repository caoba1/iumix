function doSearch() {

    var apiYTK = 'AIzaSyDn4eBLCP-WKdF5WZK3auTyfX-N5uIev6k';

  let searchQuery = document.getElementById('search-box-text').value;
    // Here we are composing the endpoint with query parameters as defined from https://developers.google.com/youtube/v3/docs/search/list
    // part=snippet is like a required default
    // maxResults=10 set the number of results we want to retrieve
    // key is your custom key gotten from the previoud step
    let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=' + apiYTK + '&q=' + searchQuery;
    //let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=AIzaSyCYchlTicuWz3_usJZyluJKkW0S6OAoh7E&q=' + searchQuery;


const thisDocIdElement = document.getElementById('search-results');
    


    var ajaxSearchRequest = new XMLHttpRequest();
ajaxSearchRequest.onreadystatechange = function() {
    if (ajaxSearchRequest.readyState == XMLHttpRequest.DONE) {
        // alert(ajaxSearchRequest.responseText);
        
        let parsedResponse = JSON.parse(ajaxSearchRequest.responseText);
        console.log(ajaxSearchRequest.responseText);
        console.log("-------------------");
        console.log(parsedResponse.items.slice(1,10));

        var itemsP = parsedResponse.items.slice(1,10);
        //Perform actions on DONE! (will not work in IE)
        var popSug ="";
        for (iResults = 0; iResults < 9; iResults++) {
          /*console.log(itemsP[iResults].id.videoId);*/
          /*popSug += "<div id="+itemsP[iResults].id.videoId+">"+itemsP[iResults].snippet.title+"</div>";*/

          popSug += "<option value="+itemsP[iResults].id.videoId+">"+itemsP[iResults].snippet.title+"</option>";
        }

        thisDocIdElement.innerHTML = popSug;

        var count = Object.keys(itemsP).length;
        console.log("-------------------");
        console.log(count);
        console.log("-------------------");

    }
}
ajaxSearchRequest.open('GET', url, true);
ajaxSearchRequest.send(null);


    




};
