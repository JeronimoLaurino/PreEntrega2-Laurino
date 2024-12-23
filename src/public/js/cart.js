function removeFromCart(productId) {
    fetch(`/carts/1/products/${productId}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      alert('Producto eliminado del carrito');
      location.reload();
    })
    .catch(err => alert('Error al eliminar del carrito'));
  }
  
  function updateQuantity(productId, quantity) {
    fetch(`/carts/1/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quantity: quantity })
    })
    .then(response => response.json())
    .then(data => {
      alert('Cantidad actualizada');
      location.reload();
    })
    .catch(err => alert('Error al actualizar la cantidad'));
  }
  
  function checkout() {
    fetch(`/carts/1/checkout`, {
      method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Compra realizada con éxito');
        window.location.href = '/';
      } else {
        alert('Error en la compra');
      }
    })
    .catch(err => alert('Error al realizar la compra'));
  }