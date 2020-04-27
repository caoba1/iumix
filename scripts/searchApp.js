var apiYTK = 'AIzaSyDn4eBLCP-WKdF5WZK3auTyfX-N5uIev6k';

function doSearch() {

  let searchQuery = document.getElementById('search-box-text').value;
  // Here we are composing the endpoint with query parameters as defined from https://developers.google.com/youtube/v3/docs/search/list
  // part=snippet is like a required default
  // maxResults=10 set the number of results we want to retrieve
  // key is your custom key gotten from the previoud step
  let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=' + apiYTK + '&q=' + searchQuery;
  //let url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&key=AIzaSyCYchlTicuWz3_usJZyluJKkW0S6OAoh7E&q=' + searchQuery;


  /* NOTE: Ok, so the youtube search api does not report the content duration of every video in the list,
  so to find the duration, and list it in the search results, you would need to do a second search (see below)
  https://stackoverflow.com/questions/27393842/contentdetails-or-duration-not-coming-using-youtube-v3-api/27415212
  like it is in the setVideoTitleData function, or to append each video Id to a searchApp.
  This increases the amount of calls made to the API */

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


function setVideoTitleData(videoId, thisElementVideo, thisElementDuration, thisElementPlayerDuration){


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
      console.log('Time tag in player '+thisElementVideo.id+':'+videoDuration+'\n')
      thisElementDuration.innerHTML = videoDuration; //TODO: just jumps in left audio player tag
      thisElementPlayerDuration.innerHTML = calculateTotalValue(videoDuration);

    }
  }
  ajaxSearchRequest.open('GET', url, true);
  ajaxSearchRequest.send(null);
  //return videoTitle;//parsedResponse.items[0].snippet.title;
};

function setVideoTitleValue(videoId, thisElement){
  console.log("ENTER")
  console.log(thisElement);
  let url='https://www.googleapis.com/youtube/v3/videos?id='+videoId+'&key='+apiYTK+'&fields=items(id,snippet(channelId,title,categoryId),statistics,contentDetails(duration))&part=snippet,statistics,contentDetails';
  var videoTitle="";
  var ajaxSearchRequest = new XMLHttpRequest();
  ajaxSearchRequest.onreadystatechange = function() {
    if (ajaxSearchRequest.readyState == XMLHttpRequest.DONE) {
      let parsedResponse = JSON.parse(ajaxSearchRequest.responseText);
      console.log(ajaxSearchRequest.responseText);
      console.log("-------------------");
      console.log(parsedResponse.items[0].snippet.title);
      videoTitle=parsedResponse.items[0].snippet.title;
      thisElement.value = videoTitle;
    }
  }
  ajaxSearchRequest.open('GET', url, true);
  ajaxSearchRequest.send(null);
  //return videoTitle;//parsedResponse.items[0].snippet.title;
};



/**
*@param ytTimeFormat is a YouTube time format toString
*@return time 'length' in seconds
**/
function convertDuration(ytTimeFormat){
// TODO; Merge with calculateTotalValue
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
