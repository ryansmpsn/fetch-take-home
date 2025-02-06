import styled from 'styled-components';
import Button from './Button';

const PaginationContainer = styled.div`
  display: flex;
  margin: 1.25rem;
  gap: 0.625rem;
  align-items: center;
  justify-content: center;
`;

type PaginationProps = {
  page: number;
  setPage: (page: number) => void;
  dogIdsList: string[];
  size: number;
  total: number;
};

export default function Pagination({
  page,
  setPage,
  dogIdsList,
  size,
  total
}: PaginationProps) {
  return (
    <PaginationContainer>
      <Button
        onClick={() => setPage(Math.max(page - 1, 0))}
        disabled={page === 0}
      >
        Previous
      </Button>
      <span>
        {page + 1} of {Math.ceil(total / size)}
      </span>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={dogIdsList.length < size}
      >
        Next
      </Button>
    </PaginationContainer>
  );
}
