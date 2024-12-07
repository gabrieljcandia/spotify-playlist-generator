export interface SearchResultProps {
  searchResult: {
    song: string;
    artist: string;
  }[];
}

const SearchResult = ({ searchResult }: SearchResultProps) => {
  return (
    <div>
      {searchResult.length > 0 && (
        <>
          <div>
            <h2>Generated Songs</h2>
            <table>
              <thead>
                <tr>
                  <th>Song</th>
                  <th>Artist</th>
                </tr>
              </thead>
              <tbody>
                {searchResult.map((song, index) => (
                  <tr key={index}>
                    <td>{song.song}</td>
                    <td>{song.artist}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResult;
