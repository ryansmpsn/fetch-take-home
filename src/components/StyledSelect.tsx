import React from 'react';
import Select, { GroupBase, Props } from 'react-select';

export function StyledSelect<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>) {
  return (
    <Select
      {...props}
      styles={{
        valueContainer: (provided) => ({
          ...provided,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'auto',
          flexWrap: 'nowrap'
        }),

        control: (provided) => ({
          ...provided,
          padding: '5px',
          display: 'grid',
          gridTemplateColumns: '1fr auto'
        }),
        multiValue: (provided) => ({
          ...provided,
          minWidth: 'auto'
        })
      }}
    />
  );
}
