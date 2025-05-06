import { useState } from 'react';
import { Box } from 'theme-ui';

function Tabs({ tabs, activeTab, onTabChange }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* Tab Headers */}
      <Box
        sx={{
          display: 'flex',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {tabs.map((tab, index) => (
          <Box
            key={index}
            onClick={() => onTabChange(index)}
            sx={{
              padding: '12px 16px',
              cursor: 'pointer',
              fontWeight: activeTab === index ? 'bold' : 'normal',
              color: activeTab === index ? 'primary' : 'text',
              borderBottom: activeTab === index ? '2px solid primary' : 'none',
              marginBottom: activeTab === index ? '-1px' : '0',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'muted',
              }
            }}
          >
            {tab.label}
          </Box>
        ))}
      </Box>

      {/* Tab Content */}
      <Box
        sx={{
          padding: '16px',
          bg: 'background',
        }}
      >
        {tabs[activeTab].content}
      </Box>
    </Box>
  );
}

export default Tabs;