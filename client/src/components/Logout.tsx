import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose }) => {
  
      const navigate = useNavigate();
      const { logout } = useAuth(); 

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
        await logout();
        onClose();
        navigate('/login');
    } catch (error) {
        console.error('Logout error:', error);
    }
    
};

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.title}>Çıkış Yap</h3>
        <p style={styles.text}>Çıkış yapmak istediğinize emin misiniz?</p>
        
        <div style={styles.buttonContainer}>
          <button style={styles.cancelButton} onClick={onClose}>
            Hayır
          </button>
          <button style={styles.confirmButton} onClick={handleLogout}>
            Evet
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '320px',
    textAlign: 'center',
    fontFamily: 'sans-serif',
  },
  title: {
    margin: '0 0 12px 0',
    color: '#333',
  },
  text: {
    margin: '0 0 24px 0',
    color: '#666',
    fontSize: '14px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
  },
  cancelButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#dc3545', 
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};

export default LogoutModal;
