'use strict';
/* global $ */

const AUTH_KEY = 'AIzaSyDY-WtPBlCHUihW4vJ7pms84oY-1mgwYJg';
const SEARCH_ENDPOINT = 'https://www.googleapis.com/youtube/v3/search';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=';
const CHANNEL_URL = 'https://www.youtube.com/channel/';

const STORE = {
  pageTokenPrevious: null,
  pageTokenNext: null,
  searchTerm: null,
  trackPageCount: 0
};

/*********************   API Queries   *********************/

function getDataFromApi(searchValue, callback) {
  const query = {
    part: 'snippet',
    key: AUTH_KEY,
    q: searchValue,
  };
  $.getJSON(SEARCH_ENDPOINT, query, callback);
}

function getNextPageToken(callback) {
  const query = {
    part: 'snippet',
    key: AUTH_KEY,
    q: STORE.searchTerm,
    pageToken: STORE.pageTokenNext
  };
  $.getJSON(SEARCH_ENDPOINT, query, callback);
}

function getPrevPageToken(callback) {
  const query = {
    part: 'snippet',
    key: AUTH_KEY,
    q: STORE.searchTerm,
    pageToken: STORE.pageTokenPrevious
  };
  $.getJSON(SEARCH_ENDPOINT, query, callback);
}

/*********************   HTML Generators   *********************/

function renderHTML(result) { 
  return (`
      <div>
        <a href="${YOUTUBE_URL + result.id.videoId}" data-lightbox="${result.snippet.thumbnails.medium.url}" target="_blank"><img src="${result.snippet.thumbnails.medium.url}" /></a>
        <h4>${result.snippet.title}</h4>
        <a href="${CHANNEL_URL + result.snippet.channelId}" target="_blank">Channel: ${result.snippet.channelTitle}</a>
        <p>${result.snippet.publishedAt}</p>
      </div>
    `);
}

function generateYouTubeVideos(data) {
  STORE.pageTokenNext = data.nextPageToken;
  STORE.pageTokenPrevious = data.prevPageToken;
  const results = data.items.map((item) => renderHTML(item));
  $('.js-search-results').html(results);
  if (STORE.trackPageCount === 0) {
    $('.js-search-pagination').html('<button type="button" class="next-page">NextPage</button>');
  } else {
    $('.js-search-pagination').html('<button type="button" class="previous-page">PreviousPage</button><button type="button" class="next-page">NextPage</button>');
  }
}

/*********************   Event Handlers   *********************/

function handlePreviousPageClick() {
  $('.js-search-pagination').on('click', '.previous-page', () => {
    STORE.trackPageCount--;
    getPrevPageToken(generateYouTubeVideos);
  });
}

function handleNextPageClick() {
  $('.js-search-pagination').on('click', '.next-page', () => {
    STORE.trackPageCount++;
    getNextPageToken(generateYouTubeVideos);
  });
}

function handleSearchClick() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const searchTarget = $(event.currentTarget).find('.js-query');
    const search = searchTarget.val();
    STORE.searchTerm = search;
    searchTarget.val('');
    getDataFromApi(search, generateYouTubeVideos);
  });
}

$(() => {
  handleSearchClick();
  handleNextPageClick();
  handlePreviousPageClick();
});