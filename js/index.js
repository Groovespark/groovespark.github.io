jsonpproxy = 'http://jsonp.afeld.me/?url=';
musicServer = 'http://so.ard.iyyin.com/';
githubproxy = 'http://github-raw-cors-proxy.herokuapp.com/';

// Api documentation 
musicSearchSong   = 'v2/songs/search';      // ?q={query}
musicSearchAlbum  = 'v2/albums/search';     // ?q={query}
musicDownloadSong  = 'v2/songs/download';    // ?song_id={id} no jsonp
musicDownload     = 'detail.do';            // ?neid={id}

$(function() {
  var player = document.createElement('audio');
  var playercover = $('.img-cover');
  var playlists = $('.gs-playlists');
  var playing = false;
  var currentSong = null;

  Path.listen();
  
  // get playlist
  $('#gs-playsearch').click(function(e) {
    gsplaylist = encodeURI($('.gs-username').val())+'/gs-playlists/master/';
    gsplaylistindex = gsplaylist + 'index.json';
    playlists.html('');

    $.ajax({
      url: githubproxy + gsplaylistindex,  
      dataType: 'jsonp',                                                                          
      success: function(data){      
        $.each(data['playlists'], function(i) {
          jsonplaylists = data['playlists'][i];
          playlistname = jsonplaylists['pathname'].replace('.json', '');
          playlists.append('<li class="gs-playlist"><a class="gs-playlistname" href="#'+ playlistname +'">'+ playlistname + '</a><ul class="gs-playlistall">');
          console.log(githubproxy + gsplaylist + encodeURI(jsonplaylists['pathname']));
          $.ajax({
            url: githubproxy + gsplaylist + encodeURI(jsonplaylists['pathname']),
            dataType: 'jsonp',
            success: function(dataPlay){
              $.each(dataPlay['songs'], function(j) {
                song = dataPlay['songs'][j];

                $('.gs-playlistall').eq(i).append('<li><a class="gs-playsong" data-songid="'+ song['id']+'" data-artistname="'+ song['artist'] +'" data-songname="' + song['track'] + '" href="javascript:void(0);">' + song['track'] + ' - '+ song['artist'] +'</a></li>');
                // $(this).html('<li><a class="gs-playsong" href="#'+ song['id']+'">' + song['track'] + ' - '+ song['artist'] +'</a></li>');
              });
            }
          });
          playlists.append('</ul></li>');
        });
      }
    });
    e.preventDefault();
  });

  // Music player
  $('body').on('click', '.gs-playsong', function(event) {
    id = $(this).data('songid');
    song = $(this).data('songname');
    artist = $(this).data('artistname');

    // Reset style of the previous playing song
    if (currentSong !== null) {
      currentSong.removeClass('current-song');
    }

    currentSong = $(this);

    // .current-song has unique styling in the css so it will stand out which song is currently playing
    currentSong.addClass('current-song');

    $.ajax({
      url: musicServer + musicDownload,   
      dataType: 'jsonp',
      data: 'neid=' + id,
      success: function(data){
        sourceList = data['data']['itemList'];
        
        player.src = sourceList[[sourceList.length-1]]['downUrl'];
        player.play();
      }
    });
    getArtwork(artist + ' ' + song); // We can use the api for this
    $('.gs-currentsong').html(song + ' - ' + artist);
  });

  // Playlist expand
  $('.gs-playlists').on('click', '.gs-playlistname', function(event) {
    var pl = $(this).parent().find('.gs-playlistall');
    if (pl.hasClass('ex-playlist')) {
      pl.removeClass('ex-playlist');
    } else {
      pl.addClass('ex-playlist');
    }
  });

  function getArtwork(searchkey) {
    $.ajax({
      url: 'https://itunes.apple.com/search?media=music&limit=1&term=' + searchkey,  
      dataType: 'jsonp',
      success: function(data){
        console.log(data);
        if (data['resultCount'] != 0) {
          playercover.css('background-image', 'url(' + data['results'][0]['artworkUrl100'] + ')');
        } else {
          playercover.css('background-image', 'url(http://placehold.it/100x100)');
        }
      }
    });
  }

  player.addEventListener('playing',function() {
    document.title = '▶ Groovespark';
    $('.player-play').html('▮▮');
    playing = true;
  }); 

  player.addEventListener('pause',function() {
    document.title = 'Groovespark';
    $('.player-play').html('‣');
    playing = false;
    player.currentTime;
    $('.progress-inner').css('width', player.currentTime / player.duration * 100 + '%');
  });

  player.addEventListener('timeupdate',function() {
    $('.progress-inner').css('width', player.currentTime / player.duration * 100 + '%');
  });

  $('.l-playercontrols').on('click', '.player-play', function(event) {
    console.log(playing);
    if (playing) {
      player.pause();
    } else {
      player.play();
    }
  });
});

/*
* Layout:
*/
function container(type) {
  var container = $('.l-content');
  switch (type) {
    case 'home':
      container.html('HOME');
      break;
    
    case 'search':
      container.html('<form class="gs-musicsearch" action="">' +
        '<input type="text" placeholder="Song" class="gs-searchquery">' +
        '<input type="submit" value="Search" class="btn" id="gs-search">' +
        '</form>' +
        '<div class="gs-results">' +
        '<ul class="gs-albums"></ul>' +
        '<ul class="gs-songs"></ul>' +
        '</div>');
        
      // Add listener
      $('#gs-search').click(function(e) {
        document.location.hash = "/search/" + $('.gs-searchquery').val();
        e.preventDefault();  
      });

      break;
    
    case 'album':
      container.html('<div class="gs-results"><ul class="gs-songs"></ul></div>');
      break;
    

    case 'home':
      container.html('HOME');
      break;
    
    case 'help':
      container.html('help page');
      break;
    
    default:
      text = 'Looking forward to the Weekend';
  } 
}

/*
* Routes:
*/
Path.root('#/search');

Path.map('#/playlist(/:name)').to(function() {
  console.log(this.params['name']);
});

Path.map('#/search(/:keywords)').to(function(){
  container('search');
  var keywords = this.params['keywords'] || '';
  if (keywords == '') 
    return;
  $('.gs-searchquery').val(keywords);

  $('.gs-results').html('<ul class="gs-albums"></ul><ul class="gs-songs"></ul>');

  // Album search
  $.ajax({
    url: musicServer + musicSearchAlbum,  
    dataType: 'jsonp',
    data: 'q='+ keywords,
    success: function(data){
      console.log(data);
      $.each(data['data'], function(i) {
        song = data['data'][i];
        console.log(data['data'])
        $('.gs-albums').append('<li><a class="gs-album" href="#/album/'+ song['song_ids'] +'"><img src="' + song['pic200'] + '"/>' + song['name'] +'</a></li>');
      });
    }
  });

  // Music Search
  $.ajax({
    url: musicServer + musicSearchSong,  
    dataType: 'jsonp',
    data: 'q='+ keywords + '&size=24',
    success: function(data){
      console.log(data);
      $.each(data['data'], function(i) {
        song = data['data'][i];
        $('.gs-songs').append('<li><a class="gs-playsong" data-songid="'+ song['song_id']+'" data-artistname="'+ song['singer_name'] +'" data-songname="' + song['song_name'] + '" href="javascript:void(0);">' + song['song_name'] + ' <span class="subtitle">'+ song['singer_name'] + '</span>' +'</a></li>');
      });
    }
  });
});

Path.map('#/album/:ids').to(function() {
  container('album');
  
  var ids = this.params['ids'] || '';
  $.ajax({
    url: jsonpproxy + musicServer + musicDownloadSong + '?song_id=' + ids,  
    dataType: 'jsonp',
    success: function(data){
      console.log(ids)
      console.log(data)
      $.each(data['data'], function(i) {
        song = data['data'][i];
        $('.gs-songs').append('<li><a class="gs-playsong" data-songid="'+ song['song_id']+'" data-artistname="'+ song['singer_name'] +'" data-songname="' + song['song_name'] + '" href="javascript:void(0);">' + song['song_name'] + ' <span class="subtitle">'+ song['singer_name'] + '</span>' +'</a></li>');
      });
    }
  });
});

Path.map('#/help').to(function() {
  container('help');
});