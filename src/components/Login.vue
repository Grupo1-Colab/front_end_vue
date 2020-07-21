<template>
    <!-- Etiqueta para centrar el contenido del formulario -->
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 xl4>
            <v-card>
                <v-toolbar color="yellow darken-2">
                    <v-toolbar-title>
                        Ingresa al Sistema
                    </v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <!-- Campo de Email -->
                    <v-text-field
                        v-model="email"
                        autofocus
                        color="accent"
                        label="Correo Electrónico"
                        required
                    ></v-text-field>
                    <!-- Fin Campo Email -->
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
                        <v-btn color="light-green lighten-1">Ingresar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
export default {
    data() {
        return {
            email: '',
            password: ''
        }
    },
}
</script>