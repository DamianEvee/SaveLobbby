document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Selección de Elementos del DOM
    // ==========================================
    const createPostBtn = document.getElementById('create-post-btn');
    const postModal = document.getElementById('post-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const submitPostBtn = document.getElementById('submit-post-btn');
    const gamesContainer = document.getElementById('games-container');
    const mainFeed = document.getElementById('main-feed');

    // Elementos de Autenticación
    const loginBtn = document.getElementById('login-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth-btn');
    const submitAuthBtn = document.getElementById('submit-auth-btn');
    const authTitle = document.getElementById('auth-title');
    const authUsername = document.getElementById('auth-username');
    const authPassword = document.getElementById('auth-password');
    const usernameDisplay = document.getElementById('username-display');
    const toggleAuthContainer = document.getElementById('toggle-auth-mode').parentElement;

    let isLoginMode = true; // Empieza siempre en modo "Iniciar Sesión"

    // Contenedor dinámico para los posts
    let postsContainer = document.getElementById('posts-container');
    if (!postsContainer) {
        postsContainer = document.createElement('div');
        postsContainer.id = 'posts-container';
        postsContainer.className = 'posts-list';
        mainFeed.appendChild(postsContainer);
    }

    // ==========================================
    // 2. Lógica de Modales (Abrir / Cerrar)
    // ==========================================
    // Modal de Publicaciones
    createPostBtn.addEventListener('click', () => {
        postModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    });
    closeModalBtn.addEventListener('click', () => cerrarModal(postModal));

    // Modal de Autenticación
    loginBtn.addEventListener('click', () => {
        // Si el botón dice "Cerrar Sesión", limpiamos los datos y recargamos
        if (loginBtn.innerText === 'Cerrar Sesión') {
            localStorage.removeItem('savelobby_user');
            location.reload();
            return;
        }
        authModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    closeAuthBtn.addEventListener('click', () => cerrarModal(authModal));

    // Cerrar clicando fuera del recuadro
    window.addEventListener('click', (event) => {
        if (event.target === postModal) cerrarModal(postModal);
        if (event.target === authModal) cerrarModal(authModal);
    });

    function cerrarModal(modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; 
    }

    // ==========================================
    // 3. Lógica de Autenticación (Login / Registro)
    // ==========================================
    
    // Alternar entre Iniciar Sesión y Registro
    toggleAuthContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            isLoginMode = !isLoginMode;
            
            if (isLoginMode) {
                authTitle.innerText = 'Iniciar Sesión';
                submitAuthBtn.innerText = 'Entrar a la Lobby';
                toggleAuthContainer.innerHTML = `¿No tienes cuenta? <a href="#" style="color: var(--accent-color); text-decoration: none; font-weight: bold;">Regístrate aquí</a>`;
            } else {
                authTitle.innerText = 'Crear Cuenta';
                submitAuthBtn.innerText = 'Registrarse';
                toggleAuthContainer.innerHTML = `¿Ya tienes cuenta? <a href="#" style="color: var(--accent-color); text-decoration: none; font-weight: bold;">Inicia Sesión</a>`;
            }
        }
    });

    // Enviar datos al Backend
    submitAuthBtn.addEventListener('click', async () => {
        const username = authUsername.value.trim();
        const password = authPassword.value.trim();

        if (!username || !password) {
            alert('Por favor, rellena tu usuario y contraseña.');
            return;
        }

        const endpoint = isLoginMode ? '/api/login' : '/api/register';
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`¡Bienvenido a la Lobby, ${data.username}!`);
                
                // Guardamos la sesión en el navegador
                localStorage.setItem('savelobby_user', JSON.stringify({ id: data.userId, username: data.username }));
                
                // Actualizamos la interfaz
                actualizarUIUsuario(data.username);
                cerrarModal(authModal);
                authUsername.value = '';
                authPassword.value = '';
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error de autenticación:', error);
            alert('Error al conectar con el servidor.');
        }
    });

    // Función para cambiar "Invitado" por el nombre del usuario
    function actualizarUIUsuario(username) {
        usernameDisplay.innerText = username;
        usernameDisplay.style.color = 'var(--accent-color)';
        usernameDisplay.style.fontWeight = 'bold';
        loginBtn.innerText = 'Cerrar Sesión';
    }

    // Comprobar si ya iniciamos sesión anteriormente al cargar la página
    const userSaved = localStorage.getItem('savelobby_user');
    if (userSaved) {
        const user = JSON.parse(userSaved);
        actualizarUIUsuario(user.username);
    }

    // ==========================================
    // 4. Captura y Envío de la Publicación
    // ==========================================
    submitPostBtn.addEventListener('click', async () => {
        const gameInput = document.getElementById('game-input').value.trim();
        const content = document.getElementById('post-content').value.trim();
        
        const checkedTags = Array.from(document.querySelectorAll('input[name="post-tag"]:checked'))
                                 .map(checkbox => checkbox.value);

        if (!gameInput || !content || checkedTags.length === 0) {
            alert('Por favor, selecciona un juego, escribe un mensaje y elige al menos una etiqueta obligatoria.');
            return;
        }

        // Obtener el ID del usuario si está logueado, sino usar ID 1 (Invitado)
        const currentUser = localStorage.getItem('savelobby_user');
        const userId = currentUser ? JSON.parse(currentUser).id : 1;

        const originalBtnText = submitPostBtn.innerText;
        submitPostBtn.innerText = 'Publicando...';
        submitPostBtn.disabled = true;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Añadimos el userId real al envío
                body: JSON.stringify({ gameName: gameInput, content: content, tags: checkedTags, userId: userId })
            });

            const data = await response.json();

            if (response.ok) {
                document.getElementById('game-input').value = '';
                document.getElementById('post-content').value = '';
                document.getElementById('media-upload').value = '';
                document.querySelectorAll('input[name="post-tag"]').forEach(cb => cb.checked = false);
                
                cerrarModal(postModal);
                cargarFeed();
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al enviar la publicación:', error);
            alert('Hubo un error de conexión con el servidor.');
        } finally {
            submitPostBtn.innerText = originalBtnText;
            submitPostBtn.disabled = false;
        }
    });

    // ==========================================
    // 5. Cargar Datos del Feed
    // ==========================================
    async function cargarFeed() {
        try {
            const response = await fetch('/api/feed');
            const data = await response.json();

            if (data.popularGames && data.popularGames.length > 0) {
                gamesContainer.innerHTML = ''; 
                data.popularGames.forEach(game => {
                    const gameCard = document.createElement('div');
                    gameCard.className = 'game-card';
                    gameCard.innerHTML = `
                        <h3 style="color: var(--accent-color); font-size: 1.2rem;">${game.name}</h3>
                        <p style="color: var(--text-secondary); font-size: 0.9rem;">${game.post_count} publicaciones</p>
                    `;
                    gamesContainer.appendChild(gameCard);
                });
            } else {
                gamesContainer.innerHTML = '<p class="loading-text">Aún no hay juegos en la lobby.</p>';
            }

            postsContainer.innerHTML = '<h2 style="margin-top: 2rem; margin-bottom: 1rem;">Última Actividad</h2>';
            if (data.posts && data.posts.length > 0) {
                data.posts.forEach(post => {
                    const tagsHtml = post.tags.split(',').map(tag => 
                        `<span style="background: var(--accent-color); color: var(--bg-main); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: bold; margin-right: 0.5rem;">${tag}</span>`
                    ).join('');
                    
                    const postElement = document.createElement('div');
                    postElement.style.backgroundColor = 'var(--bg-surface)';
                    postElement.style.padding = '1.5rem';
                    postElement.style.borderRadius = '8px';
                    postElement.style.border = '1px solid var(--border-color)';
                    postElement.style.marginBottom = '1rem';
                    
                    postElement.innerHTML = `
                        <div style="margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                            <strong style="color: var(--text-primary); font-size: 1.1rem;">${post.username}</strong> 
                            <span style="color: var(--text-secondary);">jugando a</span> 
                            <span style="color: var(--accent-color); font-weight: bold;">${post.gameName}</span>
                            <span style="color: var(--text-secondary); font-size: 0.8rem; float: right;">
                                ${new Date(post.created_at).toLocaleString()}
                            </span>
                        </div>
                        <div style="margin-bottom: 1rem;">${tagsHtml}</div>
                        <div style="background: var(--bg-main); padding: 1rem; border-radius: 6px; border: 1px solid var(--border-color); color: var(--text-primary); white-space: pre-wrap;">${post.content}</div>
                    `;
                    postsContainer.appendChild(postElement);
                });
            } else {
                postsContainer.innerHTML += '<p class="loading-text">Nadie ha publicado nada todavía. ¡Sé el primero!</p>';
            }

        } catch (error) {
            console.error('Error al cargar el feed:', error);
            gamesContainer.innerHTML = '<p class="loading-text" style="color: #ff4444;">Error al cargar la lobby.</p>';
        }
    }

    cargarFeed();

    // ==========================================
    // 6. Registro del Service Worker (PWA)
    // ==========================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../public/service-worker.js')
                .then((registration) => {
                    console.log('Service Worker registrado con éxito:', registration.scope);
                })
                .catch((error) => {
                    console.log('Fallo al registrar el Service Worker:', error);
                });
        });
    }
});