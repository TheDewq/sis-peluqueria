import React from 'react';

const Receipt = React.forwardRef(({ items, total, payment, change, customer }, ref) => {
  return (
    <div ref={ref} className="receipt">
      <h2>Recibo de Venta</h2>
      <p>Cliente: {customer?.name || 'N/A'}</p>
      <p>Email: {customer?.email || 'N/A'}</p>
      <p>Teléfono: {customer?.phone || 'N/A'}</p>
      <table>
        <thead>
          <tr>
            <th>Producto/Servicio</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name || item.serviceName}</td> {/* Cambiar a serviceName si no hay name */}
              <td>{item.quantity}</td>
              <td>{item.salePrice || item.servicePrice || item.price}$</td> {/* Agregar servicePrice para servicios */}
              <td>{(item.salePrice || item.servicePrice || item.price) * item.quantity}$</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Total: {total}$</p>
      <p>Pago del Cliente: {payment}$</p>
      <p>Cambio: {change}$</p>
    </div>
  );
});

export default Receipt;


