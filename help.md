**Playlists:**  
First you have create a new repo on your github account called `gs-playlists`.
Than initialize it with a `index.json` containing: 
```
{
    "playlists":[
        {"pathname":"linktootherplaylist.json"}
    ]
}
```

If you're done with that create a `linktootherplaylist.json` and initialize it with:
```
{
    "songs":[
        {"id": "545026i1uP", "artist": "Atomic Kitten", "track": "Eternal Flame", "length": 193}
        {"id": "545026i1uP", "artist": "Atomic Kitten", "track": "Eternal Flame", "length": 193}
        {"id": "132500wAWN", "artist": "Pink Floyd", "track": "Another Brick In The Wall", "length": 343}
    ]
}
```
This is an example of some copy and paste stuff from the music api.
Later I'll automate this by letting GS generating a playlist .json so you can copy and paste that.

**Disclaimer:**  
I'm not responsible for anything GS does. 
I just fetch data from 3th parties.
