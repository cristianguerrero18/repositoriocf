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
export const getUsuarioPorId = async (id) => {
    // Validación mejorada del ID
    if (!id || isNaN(Number(id))) {
        console.error('ID inválido recibido:', id);
        throw new Error("ID de usuario no válido");
    }

    try {
        const response = await fetch(`${url}${id}`);
        
        if (!response.ok) {
            // Intenta obtener el mensaje de error del servidor
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error al obtener usuario ID ${id}:`, error);
        throw error;
    }
};


export const updateUsuario = async (id, usuario) => {
    try {
        // Validación del ID
        if (!id || isNaN(Number(id))) {
            throw new Error("ID de usuario no válido");
        }

        const respuesta = await fetch(`${url}${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuario)
        });

        if (!respuesta.ok) {
            const errorData = await respuesta.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${respuesta.status}`);
        }

        return await respuesta.json();
    } catch (error) {
        console.error(`Error al actualizar usuario ID ${id}:`, error);
        throw error;
    }
};