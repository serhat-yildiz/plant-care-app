// Clerk authentication component configuration
export const clerkAppearance = {
  layout: {
    logoPlacement: 'inside' as const,
    logoImageUrl: 'https://cdn-icons-png.flaticon.com/512/628/628324.png',
    showOptionalFields: true,
    socialButtonsVariant: 'iconButton' as const
  },
  elements: {
    rootBox: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      maxWidth: '450px',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'visible'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      margin: '0 auto',
      maxHeight: 'none'
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#166534' // dark green color
    },
    formButtonPrimary: {
      backgroundColor: '#16a34a', // green-600
      color: 'white',
      fontWeight: 'medium',
      borderRadius: '0.375rem',
      transition: 'all 150ms ease-in-out',
      '&:hover': {
        backgroundColor: '#15803d' // green-700
      },
      '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(22, 163, 74, 0.5)' // green-600 with opacity
      }
    },
    formFieldLabel: {
      color: '#334155', // slate-700
      fontSize: '0.875rem',
      fontWeight: '500'
    },
    formFieldInput: {
      color: '#1e293b', // slate-800
      borderRadius: '0.375rem',
      borderColor: '#cbd5e1', // slate-300
      '&:focus': {
        borderColor: '#16a34a', // green-600
        boxShadow: '0 0 0 1px rgba(22, 163, 74, 0.5)' // green-600 with opacity
      }
    },
    identityPreview: {
      borderRadius: '0.375rem',
      borderColor: '#e5e7eb' // gray-200
    },
    footerActionLink: {
      color: '#16a34a', // green-600
      '&:hover': {
        color: '#15803d' // green-700
      }
    }
  }
}; 