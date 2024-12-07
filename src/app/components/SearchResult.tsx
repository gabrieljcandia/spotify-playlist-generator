import styled from 'styled-components';

export interface SearchResultProps {
  searchResult: {
    song: string;
    artist: string;
  }[];
}

const ResultContainer = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
`;

const TableHeader = styled.th`
  background-color: #4caf50;
  color: white;
  text-align: left;
  padding: 12px;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
`;

const SearchResult = ({ searchResult }: SearchResultProps) => {
  return (
    <ResultContainer>
      {searchResult.length > 0 && (
        <>
          <h2>Generated Songs</h2>
          <Table>
            <thead>
              <tr>
                <TableHeader>Song</TableHeader>
                <TableHeader>Artist</TableHeader>
              </tr>
            </thead>
            <tbody>
              {searchResult.map((song, index) => (
                <TableRow key={index}>
                  <TableCell>{song.song}</TableCell>
                  <TableCell>{song.artist}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </ResultContainer>
  );
};

export default SearchResult;
