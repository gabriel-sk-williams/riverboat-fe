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
      <div className='flex-center'>
        {tabs.map((tab, index) => (
          <Box
            key={index}
            onClick={() => onTabChange(index)}
            sx={{
              padding: '12px 16px',
              cursor: 'pointer',
              fontWeight: activeTab === index ? 'bold' : 'normal',
              color: activeTab === index ? '#333' : 'text',
              borderBottom: activeTab === index ? '2px solid #333' : 'none',
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
      </div>
    </Box>
  );
}

export default Tabs;