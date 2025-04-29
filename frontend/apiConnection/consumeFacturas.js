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