export default {
  colors: {
    text: '#000',
    background: '#fff',
    primary: '#66aacc', // '#3399cc',
    secondary: '#336680', // '#7340b3',
    muted: '#f6f6f6',
    mutedDark:   '#e0e0e0',

    // 5AA9E6 blue from deck

    // ApprovalState colors
    pendingBg: '#f6f6f6',
    landedBg:  '#71bd71',
    missedBg:  '#db6a67',
    pushBg:    '#7340b3',
    white:     '#ffffff',
  },

  buttons: {

    // PaidState Buttons
    PAID: {
      bg: 'landedBg',
      color: 'white',
    },
    UNPAID: {
      bg: 'pendingBg',
      color: 'black',
    },
    
    // ApprovalState Buttons
    PENDING: {
      bg: 'pendingBg',
      color: 'black',
    },
    LANDED: {
      bg: 'landedBg',
      color: 'white',
    },
    MISSED: {
      bg: 'missedBg',
      color: 'white',
    },
    PUSH: {
      bg: 'pushBg',
      color: 'white',
    },

    primary: {
      color: 'background',
      bg:    'primary',
      cursor: 'pointer',

      '&:hover:enabled': {
        bg: 'secondary',
      },

      '&:disabled': {
        bg:     'muted',
        // color:  'mutedDark',
        cursor: 'default',
      },
      
      '&:disabled:hover': {
        bg: 'mutedDark',
      },
    },
  },
}