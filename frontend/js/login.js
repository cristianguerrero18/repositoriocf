import { getUsuarioPorCorreo } from '../apiConnection/consumeUsuarios.js';

document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos del DOM
    const roleSelection = document.getElementById('role-selection');
    const adminOption = document.getElementById('admin-option');
    const clientOption = document.getElementById('client-option');
    const clientForm = document.getElementById('client-form');
    const registerForm = document.getElementById('register-form');
    const registerLink = document.getElementById('register-link');
    const backFromClient = document.getElementById('back-from-client');
    const backFromRegister = document.getElementById('back-from-register');
    
    // Elementos de formulario
    const clientLoginForm = document.getElementById('client-login-form');
    const clientRegisterForm = document.getElementById('client-register-form');
    
    // Elementos de mensajes
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // API URL
    const url = "http://localhost:5000/api/usuarios/";

    // Función para obtener usuario por correo
    const getUsuarioPorCorreo = async (email) => {
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

    // Navegación entre formularios
    adminOption.addEventListener('click', function() {
        const adminUser = {
            id: 0,
            nombre: "Administrador",
            email: "admin@directo.com",
            tipo: "admin"
        };
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        window.location.href = 'index.html';
    });
    
    clientOption.addEventListener('click', showClientForm);
    registerLink.addEventListener('click', showRegisterForm);
    backFromClient.addEventListener('click', showRoleSelection);
    backFromRegister.addEventListener('click', showClientForm);

    if (clientLoginForm) {
        clientLoginForm.addEventListener('submit', handleClientLogin);
    }
    
    if (clientRegisterForm) {
        clientRegisterForm.addEventListener('submit', handleClientRegister);
    }

    function showClientForm() {
        roleSelection.style.display = 'none';
        clientForm.style.display = 'block';
        registerForm.style.display = 'none';
        clearMessages();
    }

    function showRegisterForm(e) {
        if (e) e.preventDefault();
        clientForm.style.display = 'none';
        registerForm.style.display = 'block';
        clearMessages();
    }

    function showRoleSelection() {
        clientForm.style.display = 'none';
        registerForm.style.display = 'none';
        roleSelection.style.display = 'flex';
        clearMessages();
    }

    function clearMessages() {
        if (errorMessage) {
            errorMessage.textContent = '';
            errorMessage.classList.add('d-none');
        }
        if (successMessage) {
            successMessage.textContent = '';
            successMessage.classList.add('d-none');
        }
    }

    // LOGIN CLIENTE
    async function handleClientLogin(e) {
        e.preventDefault();
        clearMessages();
        
        const email = document.getElementById('client-email').value;
        const password = document.getElementById('client-password').value;

        try {
            // Primero hacemos login
            const response = await fetch('http://localhost:5000/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, tipo_usuario: 'cliente' })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Credenciales incorrectas');
            }

            // Si el login es exitoso, ahora buscamos el usuario por su correo
            const usuarioData = await getUsuarioPorCorreo(email);

            if (usuarioData && usuarioData.id_usuario) {
                alert(`ID del usuario ingresado: ${usuarioData.id_usuario}`);
            }

            // Guardar datos en localStorage
            localStorage.setItem('currentUser', JSON.stringify({
                id: usuarioData.id_usuario,   
                nombre: usuarioData.nombre,
                email: usuarioData.email,
                tipo: 'cliente'
            }));

            window.location.href = 'cliente.html';
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message);
        }
    }

    // REGISTRO CLIENTE
    async function handleClientRegister(e) {
        e.preventDefault();
        clearMessages();
        
        const nombre = document.getElementById('register-nombre').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const direccion = document.getElementById('register-direccion').value;
        const telefono = document.getElementById('register-telefono').value;
        const cedula = document.getElementById('register-cedula').value;
        
        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden');
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    password,
                    direccion,
                    telefono: parseInt(telefono),
                    tipo: 'cliente',
                    cedula: parseInt(cedula),
                    fecha_registro: new Date().toISOString().split('T')[0]
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }
            
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.id_usuario,    
                nombre: data.nombre,
                email: data.email,
                tipo: 'cliente'
            }));

            showSuccess('Registro exitoso. Ahora puedes iniciar sesión.');
            clientRegisterForm.reset();
            setTimeout(() => showClientForm(), 1500);
        } catch (error) {
            console.error('Register error:', error);
            showError(error.message);
        }
    }

    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.classList.remove('d-none');
        }
    }

    function showSuccess(message) {
        if (successMessage) {
            successMessage.textContent = message;
            successMessage.classList.remove('d-none');
        }
    }
});
