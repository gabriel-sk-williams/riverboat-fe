/** @jsxImportSource theme-ui */
import React from 'react';
import { Box } from 'theme-ui'
import { useSelect } from 'downshift'
import ArrowDropDown from '../icons/arrow_drop_down.svg?react'

export default function DropdownSelect({label, naked, items, onChange}) {
  const {
    isOpen,
    selectedItem,
    highlightedIndex,
    getToggleButtonProps,
    getMenuProps,
    getItemProps,
  } = useSelect({ 
    items,
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem && onChange) {
        onChange(selectedItem)
      }
    },
  });


  const background = naked ? 'none' : '#d9d9d9';
  const px = naked ? '0' : '1rem';

  return (
    <Box sx={{ position: 'relative', width: '12rem' }}>
      {/* Control */}
      <Box
        {...getToggleButtonProps()}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontFamily: 'Space Mono',
          fontSize: '14px',
          whiteSpace: 'nowrap',
          height: '2rem',
          //width: '13rem',
          border: 'none',
          borderRadius: '20px',
          background: background,
          color: '#606060',
          px: px,
          cursor: 'pointer',
        }}
      >
        <span>
          {label}:{' '}
          <Box as="span">
            {selectedItem || items[0]}
          </Box>
        </span>
        <Box as="span" sx={{ pl: '6px', pt: '6px' }}>
          <ArrowDropDown />
        </Box>
      </Box>

      {/* Menu */}
      <Box
        {...getMenuProps()}
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          mt: 1,
          bg: 'background',
          borderRadius: '10px',
          zIndex: 10,
        }}
      >
        {isOpen &&
          items.map((item, index) => (
            <Box
              key={item}
              {...getItemProps({ item, index })}
              sx={{
                px: 3,
                py: 2,
                cursor: 'pointer',
                fontFamily: 'Space Mono',
                backgroundColor:
                  highlightedIndex === index ? '#d9d9d9' : 'transparent',
                fontWeight: selectedItem === item ? 'bold' : 'normal',
              }}
            >
              {item}
            </Box>
          ))}
      </Box>
    </Box>
  )
}
