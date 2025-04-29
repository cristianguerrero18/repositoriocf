const url = "http://localhost:5000/api/compras";

// Función para OBTENER compras (GET) - Ya la tienes
export const obtainCompras = async () => { 
  try {
    const resultado = await fetch(url);
    const compras = await resultado.json(); 
    return compras;
  } catch (error) {
    console.error("Error al obtener compras:", error);
    throw error; // Opcional: Relanzar el error para manejarlo fuera
  }
};

// Función para ENVIAR una nueva compra (POST) - ¡Nueva!
export const postCompra = async (datosCompra) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosCompra), // Envía los datos en formato JSON
    });

    if (!response.ok) {
      throw new Error("Error al procesar la compra");
    }

    const data = await response.json();
    return data; // Retorna la respuesta del servidor (ej: { message: "Compra exitosa" })

  } catch (error) {
    console.error("Error al enviar la compra:", error);
    throw error; // Opcional: Relanzar el error para manejarlo en el componente
  }
};