const url = "http://localhost:5000/api/compras";


export const obtainCompras = async () => { 
  try {
    const resultado = await fetch(url);
    const compras = await resultado.json(); 
    return compras;
  } catch (error) {
    console.error("Error al obtener compras:", error);
    throw error; 
  }
};


export const postCompra = async (datosCompra) => {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosCompra),
    });

    if (!response.ok) {
      throw new Error("Error al procesar la compra");
    }

    const data = await response.json();
    return data; 

  } catch (error) {
    console.error("Error al enviar la compra:", error);
    throw error; 
  }
};

export const obtainComprasUsuario = async (idUsuario) => {
  try {
    const response = await fetch(`${url}/usuario/${idUsuario}`);
    
    if (!response.ok) {
      throw new Error("Error al obtener compras del usuario");
    }

    const compras = await response.json();
    return compras;

  } catch (error) {
    console.error(`Error al obtener compras del usuario ${idUsuario}:`, error);
    throw error;
  }
};
