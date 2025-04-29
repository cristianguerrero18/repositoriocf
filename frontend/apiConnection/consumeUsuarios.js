const url = "http://localhost:5000/api/usuarios/"

export const obtainUsuarios = async ()=> { 
    try {
      const resultado = await fetch(url)
      const usuarios =  await resultado.json(); 
      return usuarios 
    } catch (error) {
        console.error("error");
    }
}

export const addUsuario = async (usuario) => {
  try {
      const respuesta = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify(usuario)
      });
      return await respuesta.json();
  } catch (error) {
      console.error("Error al agregar usuario:", error);
  }
};

export const deleteUsuario = async (id) => {
    try {
      const respuesta = await fetch(`${url}${id}`, {
        method: "DELETE",
      })
      return await respuesta.json()
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      throw error
    }
};
export const loginUsuario = async (email, password) => {
    try {
        const respuesta = await fetch(loginUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await respuesta.json();
        
        if (respuesta.ok) {
            return result;  // El login fue exitoso
        } else {
            throw new Error(result.message || "Error al iniciar sesión");
        }
    } catch (error) {
        console.error("Error al verificar credenciales:", error);
        throw error;
    }
};

export const getUsuarioPorCorreo = async (email) => {
  try {
      const respuesta = await fetch(`${url}correo/${encodeURIComponent(email)}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          }
      });

      const result = await respuesta.json();

      if (respuesta.ok) {
          return result; // Devuelve { id_usuario: ... }
      } else {
          throw new Error(result.message || "Error al obtener usuario por correo");
      }
  } catch (error) {
      console.error("Error al obtener usuario por correo:", error);
      throw error;
  }
};
