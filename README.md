# Mix-Match

Git was broken. Therefore, code was sent to [Millie Kembe](https://github.com/mkembe) to be pushed and committed to GitHub.

### Description
This is a music-based social networking application that allows users to see what their friends are listening to and get song recommendations based on popular music within a user's network. 

This webapp is currently being buily with ReactJS for the client-side development and Express for the server-side development. Data pertaining to user accounts and authentication is stored with Firebase.

The app utilizes the Spotify Web API and is primarily intended for use on desktop. 

Features in current development cycle:
- Secure user login and registration with Firebase Auth 
- Navigation bar with links to different sections using React Router
- Social feed displaying listening history and what is currently being listened to on Spotify
- Popular feed showing friends' most listened to songs for the day
- Seamless friend adding system
- Profile view displaying a user's display name, username, and their top 10 most listened to songs
- Manual Spotify account authentication and automatic reauthentication for continued use without constantly logging in to Spotify
- Daily Match feature taking most listened to songs between two users and creating a uniform list of song recommendations by blending the two tastes of music. 

Future features:
- Updated UI
- Friend requests 
- Profile Photos
- Posts giving users the ability to share a song with a caption or reaction
