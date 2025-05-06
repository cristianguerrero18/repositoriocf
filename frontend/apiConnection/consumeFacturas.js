const url = "http://localhost:5000/api/facturas/"

export const obtainFacturas = async ()=> { 
    try {
      const resultado = await fetch(url)
      const facturas =  await resultado.json(); 
      return facturas 
    } catch (error) {
        console.error("error");
    }
}

export const obtainFacturasPorUsuario = async (id_usuario) => { 
  try {
      const resultado = await fetch(`${url}usuario/${id_usuario}`);
      const facturas = await resultado.json(); 
      return facturas;
  } catch (error) {
      console.error("Error al obtener facturas por usuario:", error);
  }
};