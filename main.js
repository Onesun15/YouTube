'use strict';
/* global $ */

/*
App Requirements
Accept a user search term
Get JSON from the YouTube API based on the user search term
Display the thumbnail image of the returned videos
Optional Advanced functionality challenges
Make the images clickable, leading the user to the YouTube video, on YouTube
Make the images clickable, playing them in a lightbox
Show a link for more from the channel that each video came from
Show buttons to get more results (using the previous and next page links from the JSON)
*/

const AUTH_KEY = 'AIzaSyDY-WtPBlCHUihW4vJ7pms84oY-1mgwYJg';
const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const CHANNEL_ENDPOINT = 'https://www.googleapis.com/youtube/v3/channels';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=';

const STORE = {
  pageTokenPrevious: null,
  pageTokenNext: null,
  searchTerm: null
};

//  Test to see data object in console
$.getJSON(SEARCH_ENDPOINT, {
  part: 'snippet',
  key: AUTH_KEY,
  q: 'cats',
}, response => {
  console.log(response);
} );


/*********************   API Query   *********************/


function getVideoFromApi(searchVideo, callback) {
  const query = {
    part: 'snippet',
    key: AUTH_KEY,
    q: searchVideo,
    maxResults: 2,
  };
  $.getJSON(SEARCH_ENDPOINT, query, callback);
}

// function getNextPageToken(token) {
//   const query = {
//     part: 'snippet',
//     key: AUTH_KEY,
//     q: STORE.searchTerm,
//     nextPageToken: token
//   };
//   $.getJSON(SEARCH_ENDPOINT, query, token => {
//     console.log('herehereherehere', token);
//   });
// }


function renderResult(result) {
  console.log('render, ran');
  STORE.pageToken = result.nextPageToken;
  console.log(result.nextPageToken, result.kind);

  return (`
      <div>
        <a href="${YOUTUBE_URL + result.id.videoId}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" /></a>
        <h4>${result.snippet.title}</h4>
        <a href="#">${result.snippet.channelTitle}</a>
        <p>${result.snippet.publishedAt}</p>
      </div>
    `);
}

function displayYouTubeVideo(data) {
  const results = data.items.map((item) => renderResult(item));
  // const pagination = generatePagination(data);
  console.log('displayYouTubeVideo, ran');
  $('.js-search-results').html(results);
  $('.js-search-pagination').html('<button type="button" class="previous-page">PreviousPage</button><button type="button" class="next-page">NextPage</button>');
}

/*********************   Event Handlers   *********************/

function handlePreviousPageClick() {
  $('.js-search-pagination').on('click', '.previous-page', event => {
    console.log('previous hit');
  });
}

function handleNextPageClick() {
  $('.js-search-pagination').on('click', '.next-page', event => {
    console.log('next hit');
  });
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchTarget = $(event.currentTarget).find('.js-query');
    const search = searchTarget.val();
    STORE.searchTerm = search;
    // clear out the input
    searchTarget.val('');
    console.log('watchSubmit, ran');
    getVideoFromApi(search, displayYouTubeVideo);
  });
}
  
$(watchSubmit);
handleNextPageClick();
handlePreviousPageClick();
//