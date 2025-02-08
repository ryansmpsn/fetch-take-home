import { defaultTheme } from '@/styles/Theme';
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
        container: (provided) => ({ ...provided, flex: 1 }),
        valueContainer: (provided) => ({
          ...provided,
          display: 'flex',
          flexDirection: 'row',
          overflow: 'auto',
          flexWrap: 'nowrap'
        }),

        control: (provided) => ({
          ...provided,
          padding: '0.0625rem',
          display: 'grid',
          gridTemplateColumns: '1fr auto'
        }),
        multiValue: (provided) => ({
          ...provided,
          minWidth: 'auto'
        }),
        singleValue: (provided) => ({
          ...provided,
          fontSize: '0.875rem'
        }),
        placeholder: (provided) => ({ ...provided, fontSize: '0.875rem' })
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 8,
        colors: {
          ...theme.colors,
          primary25: defaultTheme.colors.quaternary,
          primary: defaultTheme.colors.primary,
          neutral20: defaultTheme.colors.lightborder
        }
      })}
    />
  );
}
