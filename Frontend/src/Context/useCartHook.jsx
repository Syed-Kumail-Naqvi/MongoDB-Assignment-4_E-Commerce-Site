import { useContext } from 'react';
import { CartContext } from './cartContextDefinition'; // Import CartContext from its definition

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};