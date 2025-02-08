'use client';

import { DogSortOption } from '@/types';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import useIsMounted from '@/hooks/useIsMounted';
import styled, { css } from 'styled-components';
import { StyledSelect } from './StyledSelect';
import Button from './Button';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  flex: 1;
`;

const SortButton = styled(Button)<{ active?: boolean }>`
  background-color: ${({ theme }) => theme.colors.muted};

  ${({ active, theme: { colors } }) =>
    active &&
    css`
      background-color: ${colors.primary};
    `};
`;

type DogSortOptionsProps = {
  onChange: (sortOption: DogSortOption) => void;
};

export default function DogSortOptions({ onChange }: DogSortOptionsProps) {
  const [sortOption, setSortOption] = useState<DogSortOption>({
    field: 'breed',
    order: 'asc'
  });

  const debouncedSort = useDebounce(sortOption);
  const isMounted = useIsMounted();

  useEffect(() => {
    onChange({ field: debouncedSort.field, order: debouncedSort.order });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSort]);

  return (
    <Container>
      <Row>
        {isMounted && (
          <StyledSelect
            aria-label="Sort by"
            options={[
              { value: 'breed', label: 'Breed' },
              { value: 'name', label: 'Name' },
              { value: 'age', label: 'Age' }
            ]}
            onChange={(selectedOption) =>
              setSortOption((prev) => ({
                ...prev,
                field: selectedOption
                  ? (selectedOption.value as DogSortOption['field'])
                  : 'breed'
              }))
            }
            defaultValue={{ value: 'breed', label: 'Breed' }}
          />
        )}

        <ButtonGroup>
          <SortButton
            active={sortOption.order === 'asc'}
            onClick={() =>
              setSortOption((prev) => ({
                ...prev,
                order: 'asc'
              }))
            }
          >
            <span>Asc ↑</span>
          </SortButton>
          <SortButton
            active={sortOption.order === 'desc'}
            onClick={() =>
              setSortOption((prev) => ({
                ...prev,
                order: 'desc'
              }))
            }
          >
            <span>Desc ↓</span>
          </SortButton>
        </ButtonGroup>
      </Row>
    </Container>
  );
}
