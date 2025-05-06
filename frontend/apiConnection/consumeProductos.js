const url = "http://localhost:5000/api/productos/"

export const obtainProductos = async ()=> { 
    try {
      const resultado = await fetch(url)
      const productos =  await resultado.json(); 
      return productos 
    } catch (error) {
        console.error("error");
    }
}

export const addProducto = async (producto) => {
  try {
      const respuesta = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(producto)
      });
      return await respuesta.json();
  } catch (error) {
      console.error("Error al agregar producto:", error);
  }
};

export const deleteProducto = async (id) => {
    try {
      const respuesta = await fetch(`${url}${id}`, {
        method: "DELETE",
      })
      return await respuesta.json()
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      throw error
    }
};

export const updateProducto = async (id, producto) => {
  try {
      const respuesta = await fetch(`${url}${id}`, {
          method: "PUT",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(producto)
      });
      return await respuesta.json();
  } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
  }
};


