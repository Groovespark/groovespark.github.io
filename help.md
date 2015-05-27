####Playlists
First off, create a new repository on your Github account called `gs-playlists`.
Next, create a file `index.json` which contains: 
```
{
    "playlists":[
        {"pathname":"NAME.json"}
    ]
}
```

If you are done with that create `NAME.json` to hold your playlist data, for example: 
```
{
    "songs":[
        {"id": "545026i1uP", "artist": "Atomic Kitten", "track": "Eternal Flame", "length": 193},
        {"id": "132500wAWN", "artist": "Pink Floyd", "track": "Another Brick In The Wall", "length": 343}
    ]
}
```
This example contains manually copied and pasted data from the music api.
Later we will automate this by letting GrooveSpark generate a `NAME.json` file with your playlist data in it so you only have to add that.

To add another playlist you just have to add the pathname to `index.json`, create the file and fill it with your data.

####Disclaimer 
We are not responsible for anything GrooveSpark does.  
GrooveSpark just fetches data from 3rd parties.
