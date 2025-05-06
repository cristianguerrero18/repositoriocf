import getConnection from "../db/database.js"
const getUsuarios =  async (req , res) => {
    
    try {
         const connection = await getConnection();
         const result = await connection.query("SELECT id_usuario, nombre, email, password, direccion, telefono, tipo, fecha_registro, cedula FROM usuarios");
         res.json(result);
    } catch (error) {
        console.log("error 505");
    }
}

const postUsuario = async (req, res) => {
    try {
        const {
            nombre,
            email,
            password,
            direccion,
            telefono,
            tipo,
            fecha_registro,
            cedula
        } = req.body;

        const usuario = {
            nombre,
            email,
            password,
            direccion,
            telefono,
            tipo,
            fecha_registro,
            cedula
        };

        const connection = await getConnection();
        await connection.query("INSERT INTO usuarios SET ?", usuario);
        res.status(201).json({ message: "Usuario agregado correctamente" });

    } catch (error) {
        console.error("Error al insertar usuario:", error);
        res.status(500).json({ error: "Error al insertar usuario", details: error.message });
    }
}

const getUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params; 
        const connection = await getConnection();
        const result = await connection.query("SELECT id_usuario, nombre, email, telefono, cedula, password, direccion FROM usuarios WHERE id_usuario = ?", id);

        if (result.length > 0) {
            res.json(result[0]); 
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener usuario por ID:", error);
        res.status(500).json({ error: "Error al obtener usuario", details: error.message });
    }
};


const deleteUsuario = async (req, res) => {
    try {
      const { id } = req.params
  
      const connection = await getConnection()
      const result = await connection.query("DELETE FROM usuarios WHERE id_usuario = ?", id)
  
      if (result.affectedRows > 0) {
        res.json({ message: "Usuario eliminado correctamente" })
      } else {
        res.status(404).json({ message: "Usuario no encontrado" })
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      res.status(500).json({ message: "Error al eliminar usuario" })
    }
  }

const loginUsuario = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const connection = await getConnection();
        const result = await connection.query(
            "SELECT id_usuario, nombre, email, tipo FROM usuarios WHERE email = ? AND password = ?", 
            [email, password]
        );

        if (result.length > 0) {
            res.json({
                success: true,
                user: result[0]
            });
        } else {
            res.status(401).json({ 
                success: false, 
                message: "Credenciales incorrectas" 
            });
        }
    } catch (error) {
        console.error("Error al verificar credenciales:", error);
        res.status(500).json({ 
            success: false, 
            error: "Error al verificar credenciales", 
            details: error.message 
        });
    }
};

const getUsuarioPorCorreo = async (req, res) => {
    try {
        const { email } = req.params; // Tomamos el email de la URL
        const connection = await getConnection();
        const result = await connection.query(
            "SELECT id_usuario, nombre FROM usuarios WHERE email = ?", 
            [email]
        );

        if (result.length > 0) {
            res.json({ 
                id_usuario: result[0].id_usuario,
                nombre: result[0].nombre 
            });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener usuario por correo:", error);
        res.status(500).json({ 
            error: "Error al obtener usuario por correo", 
            details: error.message 
        });
    }
};

const putUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            email,
            password,
            direccion,
            telefono,
            tipo,
            cedula
        } = req.body;

        const usuario = {
            nombre,
            email,
            password,
            direccion,
            telefono,
            tipo,
            cedula
        };

        const connection = await getConnection();
        const result = await connection.query(
            "UPDATE usuarios SET ? WHERE id_usuario = ?", 
            [usuario, id]
        );

        if (result.affectedRows > 0) {
            res.json({ message: "Usuario actualizado correctamente" });
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ 
            error: "Error al actualizar usuario", 
            details: error.message 
        });
    }
};

export const methodHTTP = {
    getUsuarios,
    postUsuario,
    getUsuarioPorId,
    deleteUsuario,
    loginUsuario,
    getUsuarioPorCorreo,
    putUsuario
}



