'use strict';
/* global $ */

const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3';

function getDataFromApi(searchTerm, callback) {
  const query = {
    q: `${searchTerm} in:name`,
    per_page: 5
  };
  $.getJSON(YOUTUBE_SEARCH_URL, query, callback);
}