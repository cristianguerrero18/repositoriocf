import { obtainProductos, addProducto, deleteProducto, updateProducto } from "../apiConnection/consumeProductos.js"

document.addEventListener("DOMContentLoaded", () => {
  getProductos()
  nuevoProducto()
})

function nuevoProducto() {
  const formAgregar = document.getElementById("form-agregar")
  const enviarFormularioBtn = document.getElementById("enviarFormulario")

  if (enviarFormularioBtn) {
    enviarFormularioBtn.addEventListener("click", () => {
      formAgregar.dispatchEvent(new Event("submit"))
    })
  }

  if (formAgregar) {
    formAgregar.addEventListener("submit", async (e) => {
      e.preventDefault()

      const nombrecel = document.getElementById("nombrecel").value
      const marca = document.getElementById("marca").value
      const modelo = document.getElementById("modelo").value
      const descripcion = document.getElementById("descripcion").value
      const precio_unitario = Number.parseFloat(document.getElementById("precio").value)
      const stock = Number.parseInt(document.getElementById("stock").value)
      const imagen = document.getElementById("imagen").value
      const fecha_Creacion = new Date().toISOString().split("T")[0]

      if (!nombrecel || !marca || !modelo || !descripcion || isNaN(precio_unitario) || isNaN(stock) || !imagen) {
        alert("Por favor, complete todos los campos correctamente.")
        return
      }

      const nuevoProducto = {
        nombre: nombrecel,
        marca: marca,
        modelo: modelo,
        descripcion: descripcion,
        precio_unitario: precio_unitario,
        stock: stock,
        imagen: imagen,
        fecha_Creacion: fecha_Creacion,
      }

      try {
        const respuesta = await addProducto(nuevoProducto)

        if (respuesta) {
          alert("Producto agregado correctamente")
          formAgregar.reset()
          document.querySelector("tbody").innerHTML = ""
          getProductos()
        } else {
          alert("Error al agregar el producto.")
        }
      } catch (error) {
        console.error("Error:", error)
        alert("Ocurrió un error inesperado.")
      }
    })
  }
}

async function getProductos() {
  try {
    const productosObtained = await obtainProductos();
    const container = document.querySelector("#productos-body");

    if (!container) {
      console.error("No se encontró el contenedor de la tabla");
      return;
    }

    container.innerHTML = "";

    productosObtained.forEach((producto) => {
      const { id_producto, nombre, marca, modelo, descripcion, precio_unitario, stock, imagen, fecha_Creacion } =
        producto;

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${id_producto}</td>
                <td>${nombre}</td>
                <td>${marca}</td>
                <td>${stock}</td>
                <td><img src="${imagen}" width="100px" alt="${nombre}"></td>
                <td>${fecha_Creacion}</td>
                <td>
                    <button class="btn color3 details-btn"
                        data-id="${id_producto}"
                        data-nombre="${nombre}"
                        data-marca="${marca}"
                        data-modelo="${modelo}"
                        data-descripcion="${descripcion}"
                        data-precio="${precio_unitario}"
                        data-stock="${stock}"
                        data-imagen="${imagen}"
                        data-fecha="${fecha_Creacion}">
                        Details
                    </button>
                </td>
                <td>
                    <button class="btn color2 update-btn" 
                        data-id="${id_producto}"
                        data-nombre="${nombre}"
                        data-marca="${marca}"
                        data-modelo="${modelo}"
                        data-descripcion="${descripcion}"
                        data-precio="${precio_unitario}"
                        data-stock="${stock}"
                        data-imagen="${imagen}"
                        data-fecha="${fecha_Creacion}">
                        Edit
                    </button>
                </td>
                <td><button class="btn color5 delete-btn" data-id="${id_producto}">Delete</button></td>
            `;
      container.appendChild(row);
    });

    // Agregar event listeners
    document.querySelectorAll(".details-btn").forEach((button) => {
      button.addEventListener("click", showDetails);
    });

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", handleDelete);
    });
    
    // Agregar event listener para los botones de actualización
    document.querySelectorAll(".update-btn").forEach((button) => {
      button.addEventListener("click", handleEditProducto);
    });
    
  } catch (error) {
    console.error("Error al cargar productos:", error);
    alert("Error al cargar los productos");
  }
}

async function handleDelete(event) {
  const button = event.currentTarget
  const id = button.getAttribute("data-id")

  if (!id) {
    alert("ID de producto no válido")
    return
  }

  if (confirm("¿Está seguro que desea eliminar este producto?")) {
    try {
      const respuesta = await deleteProducto(id)

      if (respuesta && respuesta.message) {
        alert(respuesta.message)
       
        document.querySelector("tbody").innerHTML = ""
        getProductos()
      } else {
        alert("Error al eliminar el producto")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Ocurrió un error al eliminar el producto")
    }
  }
}

function handleEditProducto(event) {
  const button = event.currentTarget;
  
  // Crear modal de edición
  let modal = document.getElementById('edit-producto-modal');
  if (!modal) {
      modal = document.createElement('div');
      modal.id = 'edit-producto-modal';
      modal.className = 'modal';
      document.body.appendChild(modal);

      // Estilos del modal
      modal.style.position = 'fixed';
      modal.style.top = '50%';
      modal.style.left = '50%';
      modal.style.transform = 'translate(-50%, -50%)';
      modal.style.backgroundColor = 'white';
      modal.style.padding = '20px';
      modal.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
      modal.style.zIndex = '1000';
      modal.style.borderRadius = '8px';
      modal.style.maxWidth = '500px';
      modal.style.width = '90%';
  }

  // Obtener datos del producto
  const id = button.getAttribute('data-id');
  const nombre = button.getAttribute('data-nombre');
  const marca = button.getAttribute('data-marca');
  const modelo = button.getAttribute('data-modelo');
  const descripcion = button.getAttribute('data-descripcion');
  const precio = button.getAttribute('data-precio');
  const stock = button.getAttribute('data-stock');
  const imagen = button.getAttribute('data-imagen');

  // Contenido del modal de edición
  modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <h3 style="margin: 0;">Editar Producto</h3>
          <button id="close-edit-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
      </div>
      <form id="edit-producto-form">
          <input type="hidden" id="edit-id" value="${id}">
          <div style="margin-bottom: 15px;">
              <label for="edit-nombre" style="display: block; margin-bottom: 5px;">Nombre:</label>
              <input type="text" id="edit-nombre" value="${nombre}" style="width: 100%; padding: 8px; box-sizing: border-box;">
          </div>
          <div style="margin-bottom: 15px;">
              <label for="edit-marca" style="display: block; margin-bottom: 5px;">Marca:</label>
              <input type="text" id="edit-marca" value="${marca}" style="width: 100%; padding: 8px; box-sizing: border-box;">
          </div>
          <div style="margin-bottom: 15px;">
              <label for="edit-modelo" style="display: block; margin-bottom: 5px;">Modelo:</label>
              <input type="text" id="edit-modelo" value="${modelo}" style="width: 100%; padding: 8px; box-sizing: border-box;">
          </div>
          <div style="margin-bottom: 15px;">
              <label for="edit-descripcion" style="display: block; margin-bottom: 5px;">Descripción:</label>
              <textarea id="edit-descripcion" style="width: 100%; padding: 8px; box-sizing: border-box; min-height: 80px;">${descripcion}</textarea>
          </div>
          <div style="margin-bottom: 15px;">
              <label for="edit-precio" style="display: block; margin-bottom: 5px;">Precio:</label>
              <input type="number" step="0.01" id="edit-precio" value="${precio}" style="width: 100%; padding: 8px; box-sizing: border-box;">
          </div>
          <div style="margin-bottom: 15px;">
              <label for="edit-stock" style="display: block; margin-bottom: 5px;">Stock:</label>
              <input type="number" id="edit-stock" value="${stock}" style="width: 100%; padding: 8px; box-sizing: border-box;">
          </div>
          <div style="margin-bottom: 15px;">
              <label for="edit-imagen" style="display: block; margin-bottom: 5px;">URL de la Imagen:</label>
              <input type="text" id="edit-imagen" value="${imagen}" style="width: 100%; padding: 8px; box-sizing: border-box;">
          </div>
          <button type="submit" style="background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer;">Guardar Cambios</button>
      </form>
  `;

  modal.style.display = 'block';

  // Cerrar modal
  document.getElementById('close-edit-modal').addEventListener('click', () => {
      modal.style.display = 'none';
  });

  // Manejar envío del formulario
  document.getElementById('edit-producto-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const productoActualizado = {
          nombre: document.getElementById('edit-nombre').value,
          marca: document.getElementById('edit-marca').value,
          modelo: document.getElementById('edit-modelo').value,
          descripcion: document.getElementById('edit-descripcion').value,
          precio_unitario: parseFloat(document.getElementById('edit-precio').value),
          stock: parseInt(document.getElementById('edit-stock').value),
          imagen: document.getElementById('edit-imagen').value
      };

      try {
          const respuesta = await updateProducto(id, productoActualizado);
          
          if (respuesta) {
              alert("Producto actualizado correctamente");
              modal.style.display = 'none';
              document.querySelector("#productos-body").innerHTML = "";
              getProductos();
          }
      } catch (error) {
          console.error("Error al actualizar producto:", error);
          alert("Error al actualizar producto: " + error.message);
      }
  });

  // Cerrar al hacer clic fuera del modal
  window.addEventListener('click', (e) => {
      if (e.target === modal) {
          modal.style.display = 'none';
      }
  });
}

function showDetails(event) {
  const button = event.currentTarget

  const id = button.getAttribute("data-id")
  const nombre = button.getAttribute("data-nombre")
  const marca = button.getAttribute("data-marca")
  const modelo = button.getAttribute("data-modelo")
  const descripcion = button.getAttribute("data-descripcion")
  const precio = button.getAttribute("data-precio")
  const stock = button.getAttribute("data-stock")
  const imagen = button.getAttribute("data-imagen")
  const fecha = button.getAttribute("data-fecha")

  let detailsModal = document.getElementById("details-modal")
  if (!detailsModal) {
    detailsModal = document.createElement("div")
    detailsModal.id = "details-modal"
    detailsModal.className = "modal"
    document.body.appendChild(detailsModal)

    detailsModal.style.position = "fixed"
    detailsModal.style.top = "50%"
    detailsModal.style.left = "50%"
    detailsModal.style.transform = "translate(-50%, -50%)"
    detailsModal.style.backgroundColor = "white"
    detailsModal.style.padding = "20px"
    detailsModal.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)"
    detailsModal.style.zIndex = "1000"
    detailsModal.style.borderRadius = "8px"
    detailsModal.style.maxWidth = "600px"
    detailsModal.style.width = "90%"
  }

  detailsModal.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <h3 style="margin: 0;">Detalles del Producto</h3>
            <button id="close-modal" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <tr><th style="text-align:left; padding:6px; border-bottom:1px solid #ccc;">Campo</th><th style="text-align:left; padding:6px; border-bottom:1px solid #ccc;">Valor</th></tr>
            <tr><td style="padding:6px;">ID</td><td style="padding:6px;">${id}</td></tr>
            <tr><td style="padding:6px;">Nombre</td><td style="padding:6px;">${nombre}</td></tr>
            <tr><td style="padding:6px;">Marca</td><td style="padding:6px;">${marca}</td></tr>
            <tr><td style="padding:6px;">Modelo</td><td style="padding:6px;">${modelo}</td></tr>
            <tr><td style="padding:6px;">Descripción</td><td style="padding:6px;">${descripcion}</td></tr>
            <tr><td style="padding:6px;">Precio</td><td style="padding:6px;">${precio}</td></tr>
            <tr><td style="padding:6px;">Stock</td><td style="padding:6px;">${stock}</td></tr>
            <tr><td style="padding:6px;">Imagen</td><td style="padding:6px;"><img src="${imagen}" width="100px" alt="${nombre}"></td></tr>
            <tr><td style="padding:6px;">Fecha de Creación</td><td style="padding:6px;">${fecha}</td></tr>
        </table>
    `

  detailsModal.style.display = "block"

  document.getElementById("close-modal").addEventListener("click", () => {
    detailsModal.style.display = "none"
  })

  window.addEventListener("click", (e) => {
    if (e.target === detailsModal) {
      detailsModal.style.display = "none"
    }
  })
}