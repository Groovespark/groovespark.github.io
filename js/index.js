jsonpproxy = 'http://jsonpify.herokuapp.com?resource=';

$(function() {
  // get playlist
  $("#gs-playsearch").click(function(e) {
    gsplaylist = 'https://raw.githubusercontent.com/'+$('.gs-username').val()+'/gs-playlist/master/';
    gsplaylistindex = gsplaylist + 'index.json';

    $.ajax({                                                                                      
      url: jsonpproxy + gsplaylistindex,  
      dataType: 'jsonp',                                                                          
      success: function(data){
        $('.gs-playlist').html('');
        json = JSON.parse(data);  
        $.each(json['playlists'], function(index, val) {
          $('.gs-playlist').append('<li>'+ json['playlists'][index]['pathname'].replace('.json', '') +'</li>')
          console.log(json['playlists'][index]['pathname']);
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
          $('.gs-songs').append('<li><a href="'+ song['file']+'">' + song['track'] + ' - '+ song['artist'] +'</a></li>')
        });
      }
    });
    e.preventDefault();
  });

});