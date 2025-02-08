import styled from 'styled-components';
import Button from '../../../../components/Button';
import { GetDogIdsResponse } from '@/types';
import { PAGESIZE } from '@/lib/constants';

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
  dogIds: GetDogIdsResponse;
};

export default function Pagination({ page, setPage, dogIds }: PaginationProps) {
  const { next, prev, total } = dogIds;

  return (
    <PaginationContainer>
      <Button
        onClick={() => setPage(Math.max(page - 1, 0))}
        disabled={!prev || page === 0}
      >
        Previous
      </Button>
      <span>
        {page + 1} of {Math.ceil(total / PAGESIZE)}
      </span>
      <Button
        onClick={() => setPage(page + 1)}
        disabled={!next || dogIds.resultIds.length < PAGESIZE}
      >
        Next
      </Button>
    </PaginationContainer>
  );
}
