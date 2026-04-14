import { createTheme } from '@mui/material/styles';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#0f0f11',
      paper: '#1f1f24',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#6366f1',
    },
    success: {
      main: '#10b981',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1f1f24',
          border: '1px solid #2a2a30',
          borderRadius: '12px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: '8px',
        },
        contained: {
          backgroundColor: '#6366f1',
          '&:hover': {
            backgroundColor: '#4f46e5',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a1a1e',
            '& fieldset': {
              borderColor: '#2a2a30',
            },
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6366f1',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#a1a1aa',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#6366f1',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1e',
          '& .MuiTableCell-root': {
            color: '#a1a1aa',
            fontWeight: 600,
            borderBottomColor: '#2a2a30',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: '#2a2a30',
          color: '#ffffff',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: '8px',
        },
        colorSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
        colorError: {
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
        colorWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        },
        colorPrimary: {
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          color: '#818cf8',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1f1f24',
          border: '1px solid #2a2a30',
          borderRadius: '12px',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1e',
          borderBottom: '1px solid #2a2a30',
          boxShadow: 'none',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1f1f24',
          border: '1px solid #2a2a30',
          borderRadius: '8px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: '#2a2a30',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          color: '#34d399',
          border: '1px solid rgba(16, 185, 129, 0.3)',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          color: '#fbbf24',
          border: '1px solid rgba(245, 158, 11, 0.3)',
        },
        standardInfo: {
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: '#818cf8',
          border: '1px solid rgba(99, 102, 241, 0.3)',
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#6366f1',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a2a30',
          borderRadius: '4px',
        },
        bar: {
          backgroundColor: '#6366f1',
          borderRadius: '4px',
        },
      },
    },
  },
});