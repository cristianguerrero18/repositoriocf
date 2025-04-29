import { obtainProductos, addProducto, deleteProducto } from "../apiConnection/consumeProductos.js"

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
    const productosObtained = await obtainProductos()
    const container = document.querySelector("tbody")

    if (!container) {
      console.error("No se encontró el contenedor de la tabla")
      return
    }

  
    container.innerHTML = ""

    productosObtained.forEach((producto) => {
      const { id_producto, nombre, marca, modelo, descripcion, precio_unitario, stock, imagen, fecha_Creacion } =
        producto

      const row = document.createElement("tr")
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
                <td><button class="btn color2">Edit</button></td>
                <td><button class="btn color5 delete-btn" data-id="${id_producto}">Delete</button></td>
            `
      container.appendChild(row)
    })

    
    document.querySelectorAll(".details-btn").forEach((button) => {
      button.addEventListener("click", showDetails)
    })

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", handleDelete)
    })
  } catch (error) {
    console.error("Error al cargar productos:", error)
    alert("Error al cargar los productos")
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
