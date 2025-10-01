import { useState } from 'react';
import { Box } from 'theme-ui';
import { Link, useLocation, useNavigate } from 'react-router-dom';

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
          <Link to={tab.page} key={index}>
            <Box
              onClick={() => onTabChange(index)}
              sx={{
                padding: '2px 16px',
                cursor: 'pointer',
                fontWeight: activeTab === index ? 'bold' : 'normal',
                color: activeTab === index ? '#333' : 'text',
                borderBottom: activeTab === index ? '2px solid #333' : 'none',
                marginBottom: activeTab === index ? '-1px' : '0',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#c8c8c8',
                }
              }}
            >
              <h4>{tab.label}</h4>
              {/*<h4>{tab.page}</h4>*/}
            </Box>
          </Link>
        ))}
      </div>
    </Box>
  );
}

export default Tabs;