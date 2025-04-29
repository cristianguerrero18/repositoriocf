import { obtainUsuarios, addUsuario , deleteUsuario } from "../apiConnection/consumeUsuarios.js";

document.addEventListener("DOMContentLoaded", () => {
    getUsuarios();

});


document.addEventListener('DOMContentLoaded', function() {
    const formAgregarUsuario = document.getElementById("form-agregar-usuario");
    const enviarFormulariousuarioBtn = document.getElementById("enviarFormulario-usuario");

    enviarFormulariousuarioBtn.addEventListener("click", () => {
        formAgregarUsuario.dispatchEvent(new Event('submit')); 
    });

    formAgregarUsuario.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const direccion = document.getElementById("direccion").value;
        const tipo = document.getElementById("tipo_usuario").value;
        const telefono = parseInt(document.getElementById("telefono").value);
        const cedula = parseInt(document.getElementById("cedula").value);
        const fecha_registro = new Date().toISOString().split("T")[0];

        if (!nombre || !email || !password || !direccion || isNaN(telefono) || !tipo || isNaN(cedula)) {
            alert("Por favor, complete todos los campos correctamente.");
            return;
        }

        const nuevoUsuario = {
            nombre: nombre,
            email: email,
            password: password,
            direccion: direccion,
            telefono: telefono,
            tipo: tipo,
            cedula: cedula,
            fecha_registro: fecha_registro
        };

        try {
            const respuesta = await addUsuario(nuevoUsuario); 

            if (respuesta) {
                alert("Usuario agregado correctamente");
                formAgregarUsuario.reset();
                document.querySelector("#usuarios-body").innerHTML = "";
                getUsuarios(); 
            } else {
                alert("Error al agregar el usuario."); 
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Ocurrió un error inesperado."); 
        }
    });
});
async function getUsuarios() {
    const usuariosObtained = await obtainUsuarios();
    const container = document.querySelector('#usuarios-body');
    usuariosObtained.forEach((usuario) => {
        const {
            id_usuario, nombre, email, password, direccion, telefono, tipo, fecha_registro, cedula
        } = usuario;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${id_usuario}</td>
            <td>${cedula}</td>
            <td>${nombre}</td>
            <td>${email}</td>
            <td>${tipo}</td>
            <td>${fecha_registro}</td>
            <td>
                <button class="btn color3 usuario-details-btn"
                    data-id="${id_usuario}"
                    data-nombre="${nombre}"
                    data-email="${email}"
                    data-password="${password}"
                    data-direccion="${direccion}"
                    data-telefono="${telefono}"
                    data-tipo="${tipo}"
                    data-fecha_registro="${fecha_registro}"
                    data-cedula="${cedula}">
                    Detalles Usuario
                </button>
            </td>
            <td><button class="btn color2">Edit</button></td>
             <td><button class="btn color5 delete-btn" data-id="${id_usuario}">Delete</button></td>
        `;
        container.appendChild(row);
    });

    document.querySelectorAll('.usuario-details-btn').forEach(button => {
        button.addEventListener('click', showUsuarioDetails);
    });
    document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDelete)
      });
}

function showUsuarioDetails(event) {
    const button = event.currentTarget;

    const id = button.getAttribute('data-id');
    const nombre = button.getAttribute('data-nombre');
    const email = button.getAttribute('data-email');
    const password = button.getAttribute('data-password');
    const direccion = button.getAttribute('data-direccion');
    const telefono = button.getAttribute('data-telefono');
    const tipo = button.getAttribute('data-tipo');
    const fecha_registro = button.getAttribute('data-fecha_registro');
    const cedula = button.getAttribute('data-cedula');

    let modal = document.getElementById('usuario-details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'usuario-details-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);

        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
        modal.style.zIndex = '1000';
        modal.style.borderRadius = '8px';
        modal.style.maxWidth = '600px';
        modal.style.width = '90%';
    }

    modal.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <h3 style="margin: 0;">Detalles del Usuario</h3>
            <button id="close-usuario-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><th style="text-align:left; padding:6px; border-bottom:1px solid #ccc;">Campo</th><th style="text-align:left; padding:6px; border-bottom:1px solid #ccc;">Valor</th></tr>
            <tr><td style="padding:6px;">Id</td><td style="padding:6px;">${id}</td></tr>
            <tr><td style="padding:6px;">Nombre</td><td style="padding:6px;">${nombre}</td></tr>
            <tr><td style="padding:6px;">Email</td><td style="padding:6px;">${email}</td></tr>
            <tr><td style="padding:6px;">Password</td><td style="padding:6px;">${password}</td></tr>
            <tr><td style="padding:6px;">Dirección</td><td style="padding:6px;">${direccion}</td></tr>
            <tr><td style="padding:6px;">Teléfono</td><td style="padding:6px;">${telefono}</td></tr>
            <tr><td style="padding:6px;">Tipo</td><td style="padding:6px;">${tipo}</td></tr>
            <tr><td style="padding:6px;">Fecha de Registro</td><td style="padding:6px;">${fecha_registro}</td></tr>
            <tr><td style="padding:6px;">Cédula</td><td style="padding:6px;">${cedula}</td></tr>
        </table>
    `;

    modal.style.display = 'block';

    document.getElementById('close-usuario-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function handleDelete(event) {
  const button = event.currentTarget
  const id = button.getAttribute("data-id")

  if (!id) {
    alert("ID de usuario no válido")
    return
  }

  if (confirm("¿Está seguro que desea eliminar este usuario?")) {
    try {
      const respuesta = await deleteUsuario(id)

      if (respuesta && respuesta.message) {
        alert(respuesta.message)
       
        document.querySelector("#usuarios-body").innerHTML = ""
        getUsuarios()
      } else {
        alert("Error al eliminar el usuario")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error al eliminar el usuario")
    }
  }
}