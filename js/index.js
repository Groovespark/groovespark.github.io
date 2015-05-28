jsonpproxy = 'http://jsonp.afeld.me/?url=';


$(function() {
  var player = document.getElementById("audio");
  var playercover = $(".img-cover");

  // get playlist
  $("#gs-playsearch").click(function(e) {
    gsplaylist = 'https://raw.githubusercontent.com/'+encodeURI($('.gs-username').val())+'/gs-playlists/master/';
    gsplaylistindex = gsplaylist + 'index.json';

    $.ajax({                                                                                      
      url: jsonpproxy + gsplaylistindex,  
      dataType: 'jsonp',                                                                          
      success: function(data){
        var playlists = $('.gs-playlists');
        playlists.html('');
        
        $.each(data['playlists'], function(index, val) {
          jsonplaylists = data['playlists'][index];
        
          
          playlists.append('<li>'
            + '<a href="#'+ jsonplaylists['pathname'].replace('.json', '') +'">'+ jsonplaylists['pathname'].replace('.json', '') + '</a>'
            + '<ul class="gs-playlistall">');
          $.ajax({                                                                                      
            url: jsonpproxy + gsplaylist + jsonplaylists['pathname'],  
            dataType: 'jsonp',                                                                          
            success: function(dataPlay){
              $.each(dataPlay['songs'], function(index, val) {
                song = dataPlay['songs'][index];
                $('<li><a class="gs-playsong" href="#'+ song['id']+'">' + song['track'] + ' - '+ song['artist'] +'</a></li>').appendTo('.gs-playlistall', this);
              });
            }
          });
          playlists.append('</ul></li>');
        });
      }
    });
    e.preventDefault();
  });

  // Search songs
  $("#gs-search").click(function(e) {
    gssearch = 'http://pleer.com/browser-extension/search?q='+$('.gs-searchquery').val();

    $.ajax({
      url: jsonpproxy + gssearch,  
      dataType: 'jsonp',
      success: function(data){
        $('.gs-songs').html('');
        console.log(data);
        $.each(data['tracks'], function(index, val) {
          song = data['tracks'][index];
          $('.gs-songs').append('<li><a class="gs-playsong" data-songid="'+ song['id']+'" data-artistname="'+ song['artist'] +'" data-songname="' + song['track'] + '" href="#'+ song['id']+'">' + song['track'] + ' - '+ song['artist'] +'</a></li>');
        });
      }
    });
    e.preventDefault();
  });

  // Music player
  $("body").on('click', '.gs-playsong', function(event) {
    hash = $(this).data('songid');
    song = $(this).data('songname');
    artist = $(this).data('artistname');
    player.src = "http://pleer.com/browser-extension/files/" + hash + ".mp3";
    player.play();
    getArtwork(artist + ' ' + song);
  });

  // Playlist expand
  $("body").on('click', '.gs-playlist', function(event) {
    var pl = $(this+".gs-playlistall");
    if (pl.hasClass('ex-playlist')) {
      pl.removeClass('ex-playlist');
    } else {
      pl.addClass('ex-playlist');
    }
  });


  player.addEventListener('playing',function() {
    document.title = "‣ Groovespark";
  }); 

  player.addEventListener('pause',function() {
    document.title = "װ Groovespark";
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
});

