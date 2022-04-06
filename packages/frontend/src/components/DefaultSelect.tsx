import React, { useContext } from 'react';
import Select, { GroupedOptionsType, GroupTypeBase, OptionsType, Styles, ActionMeta } from 'react-select';
import { ThemeContext } from 'styled-components';

interface DefaultSelectProps {
  options?:
    | GroupedOptionsType<
        {
          label: string;
          value: string;
        },
        GroupTypeBase<{
          label: string;
          value: string;
        }>
      >
    | OptionsType<{
        label: string;
        value: string;
      }>;
  isDisabled?: boolean;
  isLoading?: boolean;
  isClearable?: boolean;
  isRtl?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  defaultValue?:
    | {
        label: string;
        value: string;
      }
    | OptionsType<{
        label: string;
        value: string;
      }>
    | null;
  onChange?: (
    value:
      | {
          label: string;
          value: string;
        }
      | OptionsType<{
          label: string;
          value: string;
        }>
      | null,
    actionMeta: ActionMeta<{
      label: string;
      value: string;
    }>,
  ) => void;
}

const DefaultSelect: React.FC<DefaultSelectProps> = ({
  options,
  defaultValue,
  isDisabled,
  isLoading,
  isClearable,
  isRtl,
  isSearchable,
  onChange,
  isMulti,
}) => {
  const themeContext = useContext(ThemeContext);

  const customStyles: Partial<
    Styles<
      {
        label: string;
        value: string;
      },
      false,
      GroupTypeBase<{
        label: string;
        value: string;
      }>
    >
  > = {
    menu: (styles) => ({
      ...styles,
      cursor: 'pointer',
      backgroundColor: themeContext.colors.bodyHighlightColor,
      borderColor: themeContext.colors.backgroundColor,
      borderRadius: '5px',
      borderStyle: 'solid',
      borderWidth: '1px',
      boxShadow: '0px 5px 25px -4px rgba(0, 0, 0, 0.4)',
      margin: '5px 0 0 0',
      maxHeight: '200px',
      padding: '0',
    }),

    control: (styles) => ({
      ...styles,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      backgroundColor: themeContext.colors.contentColor,
      borderWidth: '2px',
      borderColor: themeContext.colors.contentColor,
      borderRadius: '5px',
      fontSize: '11pt',
      padding: '1px 0px 1px 9px',
      boxShadow: 'none',
      ':hover': {
        opacity: '0.8',
        borderColor: themeContext.colors.contentColor,
        cursor: 'pointer',
      },
      ':focus-within': {
        borderColor: themeContext.colors.primary,
      },
    }),

    multiValue: (styles) => {
      return {
        ...styles,
        backgroundColor: themeContext.colors.bodyColor,
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: themeContext.colors.fontColor,
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? themeContext.colors.contentDarkerColor
          : isFocused
          ? themeContext.colors.contentColor
          : undefined,
        color: themeContext.colors.fontColor,
        cursor: isDisabled ? 'not-allowed' : 'pointer',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? data.color : data.color),
        },
      };
    },

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    },
  };

  return (
    <div style={{ margin: '3px' }}>
      <Select
        styles={customStyles}
        options={options}
        defaultValue={defaultValue}
        isMulti={isMulti}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        onChange={onChange}
        isRtl={isRtl}
        isSearchable={isSearchable}
      />
    </div>
  );
};

export default DefaultSelect;
