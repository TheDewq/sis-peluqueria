import React from 'react';
import '../styles/styles.css';

const Receipt = React.forwardRef(({ items, total, payment, change, customer }, ref) => {
  // Calcular el total de la venta basado en los productos/servicios seleccionados
  const calculatedTotal = items.reduce((acc, item) => {
    const price = item.salePrice || item.servicePrice || item.price;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <div ref={ref} className="receipt">
      <h2>Recibo de Venta</h2>

      {/* Mostrar 'Cliente Final' si no hay un cliente seleccionado */}
      <p>Cliente: {customer?.name || 'Cliente Final'}</p>
      <p>Email: {customer?.email || 'N/A'}</p>
      <p>Teléfono: {customer?.phone || 'N/A'}</p>

      <table>
        <thead>
          <tr>
            <th>Producto/Servicio</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const price = item.salePrice || item.servicePrice || item.price;
            return (
              <tr key={item.id}>
                <td>{item.name || item.serviceName}</td> {/* Cambiar a serviceName si no hay name */}
                <td>{item.quantity}</td>
                <td>{price}$</td> {/* Mostrar el precio unitario */}
                <td>{(price * item.quantity).toFixed(2)}$</td> {/* Calcular el total por cada producto */}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Mostrar el total general de la venta */}
      <p><strong>Total:</strong> {calculatedTotal.toFixed(2)}$</p>
      <p><strong>Pago del Cliente:</strong> {payment}$</p>
      <p><strong>Cambio:</strong> {change}$</p>
    </div>
  );
});

export default Receipt;






