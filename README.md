# Scroppy (Scrobble Copy)

Music collectors listen to hundreds of artists. Their libraries can take up hundreds of gigabytes or even terabytes of space. However, our phones don't have this much storage space. This gives you two options: either you can stream your music from a server, which doesn't work offline, or cherry-pick and copy some artists to your phone.

Scroppy helps you with the latter by completely automating the process of copying your favorite artists somewhere else. It does this by reading your top artists on Last.fm, matching them to directories in your library and copying them to a destination of your choice.

## Instructions

### You need

- Basic knowledge of Node.js and the command line. Node.js and npm should be installed on your system.
- A Last.fm account with an [API key](https://www.last.fm/api/account/create)
- Some destination where you want to copy your music to
- Music library with a specific directory structure where the artist name is the top-level directory. Examples:
  - `~/Music/Artist Name/Album Name/01 - Song Name.flac`
  - `~/Music/Artist Name/Song Name.flac`

## Usage

1. Clone this repository
2. Install the dependencies with `npm install`
3. Copy the `.env.example` file to `.env` and fill in the required information
4. Run the script with `node index.js`

## Contributing

Contributions are welcome! Please open an issue or a pull request if you have any ideas or improvements.

## License

AGPL-3.0, see [LICENSE](LICENSE) for more information.
