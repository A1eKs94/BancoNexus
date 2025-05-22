import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { realizarTransaccion, obtenerCuenta } from '../api'; // si quieres obtener cuentas para seleccionar

const Deposito = () => {
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [monto, setMonto] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cuentas, setCuentas] = useState([]);

  // Opcional: cargar cuentas para mostrar en un select y enviar id
  React.useEffect(() => {
    const cargarCuentas = async () => {
      try {
        const data = await obtenerCuenta();
        setCuentas(data);
      } catch (err) {
        console.error("Error al cargar cuentas:", err);
      }
    };
    cargarCuentas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!numeroCuenta || !monto) {
      setError("Por favor completa todos los campos.");
      return;
    }

    // Buscar cuenta por número para obtener el _id
    const cuentaObj = cuentas.find(c => c.cuenta === numeroCuenta);
    if (!cuentaObj) {
      setError("Número de cuenta no encontrado.");
      return;
    }

    try {
      const data = {
        cuenta: cuentaObj._id, // envía el ObjectId
        tipo: 'deposito',
        cantidad: Number(monto),
      };

      await realizarTransaccion(data);
      setMensaje("Depósito realizado con éxito.");
      setNumeroCuenta('');
      setMonto('');
    } catch (err) {
      setError("Error al realizar el depósito.");
      console.error(err);
    }
  };

  return (
    <div className="mt-4">
      <h3>Depósito a Cuenta</h3>
      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Label>Número de Cuenta</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingrese el número de cuenta"
            value={numeroCuenta}
            onChange={(e) => setNumeroCuenta(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Monto a Depositar</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingrese el monto"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            min="1"
          />
        </Form.Group>

        <Button variant="success" type="submit">
          Realizar Depósito
        </Button>
      </Form>
    </div>
  );
};

export default Deposito;
