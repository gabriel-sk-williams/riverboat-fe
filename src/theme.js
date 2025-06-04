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

  fonts: {
    badge: 'Alright Sans', // optional custom badge font
  },

  badges: {

    // PaidState
    PAID: {
      bg: 'landedBg',
      color: 'white',
    },
    UNPAID: {
      bg: 'pendingBg',
      color: 'black',
    },

    // LockedState
    LOCKED: {
      bg: 'landedBg',
      color: 'white',
    },
    UNLOCKED: {
      bg: 'pendingBg',
      color: 'black',
    },

    // ApprovalState
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
  },

  buttons: {
    
    

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