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


function setVideoTitleData(videoId, thisElementVideo, thisElementDuration){

  var apiYTK = 'AIzaSyDn4eBLCP-WKdF5WZK3auTyfX-N5uIev6k';
  let url='https://www.googleapis.com/youtube/v3/videos?id='+videoId+'&key='+apiYTK+'&fields=items(id,snippet(channelId,title,categoryId),statistics,contentDetails(duration))&part=snippet,statistics,contentDetails';
  var videoTitle="";
  var videoDuration="";
  var ajaxSearchRequest = new XMLHttpRequest();
ajaxSearchRequest.onreadystatechange = function() {
  if (ajaxSearchRequest.readyState == XMLHttpRequest.DONE) {
      let parsedResponse = JSON.parse(ajaxSearchRequest.responseText);
      console.log(ajaxSearchRequest.responseText);
      console.log("-------------------");
      console.log(parsedResponse.items[0].snippet.title);
      videoTitle=parsedResponse.items[0].snippet.title;
      thisElementVideo.innerHTML = videoTitle;

      //Get media element convertDuration
      videoDuration=convertDuration(parsedResponse.items[0].contentDetails.duration);
      thisElementDuration.innerHTML = videoDuration;
  }
}
ajaxSearchRequest.open('GET', url, true);
ajaxSearchRequest.send(null);
//return videoTitle;//parsedResponse.items[0].snippet.title;
};

function convertDuration(ytTimeFormat){

  //thanksto  https://stackoverflow.com/questions/22148885/converting-youtube-data-api-v3-video-duration-format-to-seconds-in-javascript-no
  //function YTDurationToSeconds(duration) {
    var match = ytTimeFormat.match(/PT(\d+H)?(\d+M)?(\d+S)?/);

    match = match.slice(1).map(function(x) {
      if (x != null) {
          return x.replace(/\D/, '');
      }
    });

    var hours = (parseInt(match[0]) || 0);
    var minutes = (parseInt(match[1]) || 0);
    var seconds = (parseInt(match[2]) || 0);

    return hours * 3600 + minutes * 60 + seconds;
//  }



}
