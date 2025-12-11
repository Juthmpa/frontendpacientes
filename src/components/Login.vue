<template>
    <div class="login-container">
        <h2>Acceso al Sistema</h2>
        <form @submit.prevent="handleLogin" class="login-form">
            <input type="text" v-model="username" placeholder="Username" required>
            <input type="password" v-model="password" placeholder="Contraseña" required>

            <p v-if="error" class="error-message">{{ error }}</p>

            <button type="submit" :disabled="isLoading">
                {{ isLoading ? 'Conectando...' : 'Iniciar Sesión' }}
            </button>
        </form>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            username: '',
            password: '',
            error: '',
            isLoading: false,
            API_LOGIN_URL: 'http://localhost:8080/backend_api/api/auth/login'
        }
    },
    methods: {
        async handleLogin() {
            this.error = '';
            this.isLoading = true;

            try {
                const response = await fetch(this.API_LOGIN_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    // Normalizamos el rol a MAYÚSCULAS para evitar inconsistencias
                    const rolUpper = (data.rol || '').toString().toUpperCase();

                    // Guardar usuario completo y rol por separado
                    localStorage.setItem('currentUser', JSON.stringify(data));
                    localStorage.setItem('rol', rolUpper);

                    // Emitir al padre para que actualice la UI
                    this.$emit('login-success');

                } else {
                    this.error = data.message || 'Credenciales incorrectas.';
                }

            } catch (err) {
                console.error("Login error:", err);
                this.error = "Error de conexión con el servidor.";
            } finally {
                this.isLoading = false;
            }
        }
    }
}
</script>

<style scoped>
.login-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px; text-align: center; }
.login-form input { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.error-message { color: #dc3545; margin-bottom: 10px; }

.login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
}
.login-form input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}
.error-message {
    color: #dc3545;
    margin-bottom: 10px;
}
</style>