<template>
    <!-- Etiqueta para centrar el contenido del formulario -->
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 xl4>
            <v-form>
                <v-card>
                    <v-toolbar color="blue-grey">
                        <v-toolbar-title class="white--text">
                            Ingresa al Sistema
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <!-- Campo de Nombre de Usuario -->
                        <v-text-field
                            v-model="username"
                            autofocus
                            color="accent"
                            label="Nombre de Usuario (username)"
                            required
                        ></v-text-field>
                        <!-- Fin Campo de Nombre de Usuario -->
                        <!-- Campo Password -->
                        <v-text-field
                            v-model="password"
                            type="password"
                            color="accent"
                            label="Contraseña"
                            required
                        ></v-text-field>
                        <!-- Fin Campo Password -->
                    </v-card-text>
                    <v-card-actions class="px-3 pb-3">
                        <v-flex text-xs-right>
                            <v-btn @click="ingresar()" color="light-green lighten-1">Ingresar</v-btn>
                        </v-flex>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-flex>
    </v-layout>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        ingresar(){
            axios.post('login/', {
                'username': this.username,
                'password': this.password
            })
            .then((response) => {
                return response.data;
            })
            .then((data) => {
                this.$store.dispatch('guardarToken', data.token);
                this.$router.push({name: 'HelloWorld'});
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>