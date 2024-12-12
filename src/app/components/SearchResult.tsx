import styled from 'styled-components';

export interface SearchResultProps {
  searchResult: {
    song: string;
    artist: string;
  }[];
}

const ResultContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  color: #4caf50;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TableHeader = styled.th`
  background-color: #4caf50;
  color: white;
  text-align: left;
  padding: 12px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }

  &:hover {
    background-color: #f1f1f1;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const EmptyMessage = styled.p`
  text-align: center;
  font-size: 16px;
  color: #666;
`;

const SearchResult = ({ searchResult }: SearchResultProps) => {
  return (
    <ResultContainer>
      {searchResult.length > 0 ? (
        <>
          <Title>Generated Songs</Title>
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
      ) : (
        <EmptyMessage>No results to display.</EmptyMessage>
      )}
    </ResultContainer>
  );
};

export default SearchResult;
