export const useCart = () => {
  const cart = useState('cart', () => []);
  const addToCartButtonStatus = ref('add');
  const removeFromCartButtonStatus = ref('remove');

  const handleAddToCart = productId => {
    addToCartButtonStatus.value = 'loading';

    addToCart({ productId })
      .then(res => {
        updateCart([...cart.value, res.addToCart.cartItem]);
        addToCartButtonStatus.value = 'added';
        setTimeout(() => (addToCartButtonStatus.value = 'add'), 2000);
      })
      .catch(err => {
        addToCartButtonStatus.value = 'add';
        const errorMessage = err.response.errors[0].message
          .replace(/<a[^>]*>(.*?)<\/a>/g, '')
          .replace(/&mdash;/g, '—')
          .trim();
        push.error(errorMessage);
      });
  };

  const handleRemoveFromCart = key => {
    removeFromCartButtonStatus.value = 'loading';
    updateItemQuantities({ items: [{ key, quantity: 0 }] }).then(() => {
      removeFromCartButtonStatus.value = 'remove';
      updateCart(cart.value.filter(item => item.key !== key));
    });
  };

  const updateCart = newCart => {
    cart.value = newCart;
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  onMounted(() => {
    // Shared key with stores/cart.ts; malformed data must not crash every page.
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (Array.isArray(storedCart)) cart.value = storedCart;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  });

  return {
    cart,
    handleAddToCart,
    addToCartButtonStatus,
    handleRemoveFromCart,
    removeFromCartButtonStatus,
  };
};
