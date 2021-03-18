<template>
<v-layout align-start>
    <v-flex>
        <v-data-table :headers="headers" :items="usuarios" :search="search" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Usuarios</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-text-field
                        class="text-xs-center"
                        v-model="search"
                        append-icon="search"
                        label="Búsqueda"
                        single-line
                        hide-details
                    ></v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Usuario</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="nombre" label="Nombre del Usuario"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="apellido" label="Apellido del Usuario"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="username" label="Nombre de Usuario (Username)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="email" label="Correo electrónico"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="password" type="password" label="Contraseña"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <div class="red--text" v-for="v in validaMensaje" :key="v" v-text="v">
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                <v-btn color="blue darken-1" text @click="guardar">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog
                        v-model="adModal"
                        max-width="290px"
                        transition="dialog-transition"
                    >
                        <v-card>
                            <v-card-title primary-title class="headline" v-if="adAccion == 1">
                                Activar Usuario
                            </v-card-title>
                            <v-card-title primary-title class="headline" v-if="adAccion == 0">
                                Desactivar Usuario
                            </v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion == 1"> ACTIVAR</span>
                                <span v-if="adAccion == 0"> DESACTIVAR</span> al usuario: {{adNombre}}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="activarDesactivarCerrar()" color="orange darken-4" >Cancelar</v-btn>
                                <v-btn v-if="adAccion == 1" @click="activar()" color="green darken-1" >Activar</v-btn>
                                <v-btn v-if="adAccion == 0" @click="desactivar()" color="red" >Desactivar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
                <template v-if="item.is_active == true">
                    <v-icon small @click="activarDesactivarMostrar(0, item)">block</v-icon>
                </template>
                <template v-else>
                    <v-icon small @click="activarDesactivarMostrar(1, item)">check</v-icon>
                </template>

                <div v-if="item.is_active == true">
                    <span class="blue--text">Activo</span>
                </div>
                <div v-else>
                    <span class="red--text">Inactivo</span>
                </div>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary" >Reset</v-btn>
            </template>
        </v-data-table>
    </v-flex>
</v-layout>
</template>

<script>
import axios from 'axios'

export default {
    data: () => ({
        dialog: false,
        search: '',
        usuarios: [],
        headers: [
            { text: 'No.', value: 'id', sortable: true },
            { text: 'Nombre', value: 'first_name', sortable: true },
            { text: 'Apellido', value: 'last_name', sortable: false },
            { text: 'Nombre de Usuario', value: 'username', sortable: false },
            { text: 'Email', value: 'email', sortable: false },
            { text: 'Opciones', value: 'actions', sortable: false },
        ],
        editedIndex: -1,
        id: '',
        nombre: '',
        apellido: '',
        username: '',
        email: '',
        password: '',
        valida: 0,
        validaMensaje: [],
        adModal: 0,
        adAccion: 0,
        adNombre: '',
        adId: ''
    }),
    computed: {
    formTitle () {
            return this.editedIndex === -1 ? 'Nuevo registro' : 'Editar registro'
        },
    },

    watch: {
        dialog (val) {
            val || this.close()
        },
    },

    created () {
        this.listar()
    },

    methods: {
        listar() {
            let cat = this;
            axios.get('usuarios/listar',{headers: {
                'Authorization': `Token ${this.$store.state.token}`
            }})
            .then((response)=>{
                cat.usuarios = response.data;
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        editItem (item) {
            this.id = item.id;
            this.nombre = item.first_name;
            this.apellido = item.last_name;
            this.username = item.username,
            this.email = item.email,
            this.dialog = true;
            this.editedIndex = 1;
        },

        activarDesactivarMostrar(accion, item){
            this.adModal = 1;
            this.adNombre = item.nombre;
            this.adId = item.id;
            if (accion == 1) {
                this.adAccion = 1;
            } else if (accion == 0) {
                this.adAccion = 0;
            } else {
                this.adModal = 0;
            }
        },

        activarDesactivarCerrar(){
            this.adModal = 0;
        },

        activar(){
            let cat = this;
            let header = {'Authorization': `Token ${this.$store.state.token}`};
            let configuracion = {headers : header};
            axios.patch(`usuarios/actualizar/${this.adId}`, {
                'is_active': true,
            }, configuracion)
            .then((response) => {
                console.log(response);
                cat.adModal = 0;
                cat.adAccion = 0;
                cat.adNombre = '';
                cat.adId = ''
                cat.listar();
            })
            .catch((error) => {
                console.log(error);
            });
        },
        
        desactivar(){
            let cat = this;
            let header = {'Authorization': `Token ${this.$store.state.token}`};
            let configuracion = {headers : header};
            axios.patch(`usuarios/actualizar/${this.adId}`, {
                'is_active': false,
            }, configuracion)
            .then((response) => {
                console.log(response);
                cat.adModal = 0;
                cat.adAccion = 0;
                cat.adNombre = '';
                cat.adId = ''
                cat.listar();
            })
            .catch((error) => {
                console.log(error);
            });
        },

        close () {
            this.dialog = false;
        },

        limpiar(){
            this.nombre = '';
            this.apellido = '';
            this.password= '';
            this.username='';
            this.email='';
            this.valida = 0;
            this.validaMensaje = [];
            this.editedIndex = -1;
        },

        validar(){
            this.valida = 0;
            this.validaMensaje = [];
            if (this.nombre.length < 1 || this.nombre.length > 50) {
                this.validaMensaje.push('El nombre del usuario debe tener entre 1 a 50 caracteres.');
            }
            if (this.apellido.length < 1 || this.apellido.length > 50) {
                this.validaMensaje.push('El apellido del usuario debe tener entre 1 a 50 caracteres.');
            }
            if (this.email.length < 1 || this.email.length >50) {
                this.validaMensaje.push('El email del usuario debe tener entre 1 y 50 caracteres.');
            }
            if(this.email){
                let correoValido = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(this.email.value)
                if(!correoValido){
                    this.validaMensaje.push('Debe ingresar un email válido.');
                }
                return console.log(correoValido);
            }
            if (!this.password) {
                this.validaMensaje.push('Ingrese una contraseña.');
            }
            if(this.username){
                let usuarioValido = /^[a-z\d_]{6,30}$/i.test(this.username.value)
                if (!usuarioValido) {
                    this.validaMensaje.push('Debe ingresar un Username válido');
                }
                return console.log(usuarioValido);
            }
            if (this.validaMensaje.length) {
                this.valida = 1;
            }
            return this.valida;
        },

        guardar () {
            let cat = this;
            let header = {'Authorization': `Token ${this.$store.state.token}`};
            let configuracion = {headers : header};

            if (this.validar()) {
                return;
            }

            if (this.editedIndex > -1) {
                //Código para editar datos del registro
                axios.patch(`usuarios/actualizar/${this.id}`, {
                    'first_name': this.nombre,
                    'last_name': this.apellido,
                    'username': this.username,
                    'email': this.email,
                }, configuracion)
                .then((response) => {
                    console.log(response);
                    cat.limpiar();
                    cat.close();
                    cat.listar();
                })
                .catch((error) => {
                    console.log(error);
                });
            } else {
                //Código para guardar un nuevo registro
                axios({
                    method: 'post',
                    url: 'usuarios/crear',
                    data: {
                        'first_name': this.nombre,
                        'last_name': this.apellido,
                        'username': this.username,
                        'email': this.email,
                        'password': this.password
                    },
                    headers: {
                        'Authorization': `Token ${this.$store.state.token}`,
                        'Content-Type': 'application/json'
                    }
                })
                .then((response) => {
                    console.log(response);
                    cat.limpiar();
                    cat.close();
                    cat.listar();
                })
                .catch((error) => {
                    console.log(error);
                });
            }
            this.close();
        },
    },
}
</script>