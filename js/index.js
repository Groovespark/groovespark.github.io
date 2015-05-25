jsonpproxy = 'http://jsonpify.herokuapp.com?resource=';

$(function() {
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
        
        var playlistjson;
        json = JSON.parse(data);
        
        $.each(json['playlists'], function(index, val) {
          jsonplaylists = json['playlists'][index];
        
          
          playlists.append('<li>'
            + '<a href="#'+ jsonplaylists['pathname'].replace('.json', '') +'">'+ jsonplaylists['pathname'].replace('.json', '') + '</a>'
            + '<ul class="gs-playlistall">');
          $.ajax({                                                                                      
            url: jsonpproxy + gsplaylist + jsonplaylists['pathname'],  
            dataType: 'jsonp',                                                                          
            success: function(dataPlay){
              playlistjson = JSON.parse(dataPlay);
              $.each(playlistjson['songs'], function(index, val) {
                song = playlistjson['songs'][index];
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
          $('.gs-songs').append('<li><a class="gs-playsong" href="#'+ song['id']+'">' + song['track'] + ' - '+ song['artist'] +'</a></li>');
        });
      }
    });
    e.preventDefault();
  });

  // Music player
  $("body").on('click', '.gs-playsong', function(event) {
    var hash = window.location.hash.substring(1);
    var player = document.getElementById("audio");
    player.src = "http://pleer.com/browser-extension/files/" + hash+ ".mp3";
    player.play();
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

});