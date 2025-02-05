'use client';

import { DogSortOption } from '@/types';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import useDebounce from '@/hooks/useDebounce';
import useIsMounted from '@/hooks/useIsMounted';

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

  // TODO: Implement sorting
  useEffect(() => {
    onChange({ field: debouncedSort.field, order: debouncedSort.order });
  }, [debouncedSort]);

  const toggleOrder = () => {
    setSortOption((prev) => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <>
      {isMounted && (
        <Select
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

      <button onClick={toggleOrder}>
        {sortOption.order === 'asc' ? 'Ascending' : 'Descending'}
      </button>
    </>
  );
}
