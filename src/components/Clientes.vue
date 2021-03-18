<template>
<v-layout align-start>
    <v-flex>
        <v-data-table :headers="headers" :items="clientes" :search="search" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Clientes</v-toolbar-title>
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
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Cliente</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="first_name" label="first_name y Apellido del Cliente"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="last_name" label="last_name actual (Q)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="username" label="Crédito límite del cliente (Q)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="email" label="Número de Calle"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="comuna" label="Comuna"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="ciudad" label="Ciudad"></v-text-field>
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
                    <!-- <v-dialog
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
                                <span v-if="adAccion == 0"> DESACTIVAR</span> al usuario: {{adfirst_name}}
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn @click="activarDesactivarCerrar()" color="orange darken-4" >Cancelar</v-btn>
                                <v-btn v-if="adAccion == 1" @click="activar()" color="green darken-1" >Activar</v-btn>
                                <v-btn v-if="adAccion == 0" @click="desactivar()" color="red" >Desactivar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog> -->
                </v-toolbar>
            </template>
            <!-- <template v-slot:item.actions="{ item }">
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
            </template> -->
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
        clientes: [],
        headers: [
            { text: 'No.', value: 'id', sortable: true },
            { text: 'Nombre', value: 'first_name', sortable: true },
            { text: 'Apellido', value: 'last_name', sortable: false },
            { text: 'Username', value: 'username', sortable: false },
            { text: 'Email', value: 'email', sortable: false },
        ],
        editedIndex: -1,
        id: '',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        
        valida: 0,
        validaMensaje: [],
        adModal: 0,
        adAccion: 0,
        adfirst_name: '',
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
            axios.get('clientes/listar',{headers: {
                'Authorization': `Token ${this.$store.state.token}`
            }})
            .then((response)=>{
                cat.clientes = response.data;
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        close () {
            this.dialog = false;
        },

        limpiar(){
            this.id = '';
            this.first_name = '',
            this.last_name = '',
            this.username = '',
            this.email = '',

            this.valida = 0;
            this.validaMensaje = [];
            this.editedIndex = -1;
        },

        validar(){
            this.valida = 0;
            this.validaMensaje = [];
            if (this.first_name.length < 1 || this.first_name.length > 50) {
                this.validaMensaje.push('El Nombre de cliente debe tener entre 1 a 50 caracteres.');
            }
            if (this.last_name.length < 1 || this.last_name.length > 50) {
                this.validaMensaje.push('El Apellido de cliente debe tener entre 1 a 50 caracteres.');
            }
            if (this.username.length < 1 || this.username.length > 50) {
                this.validaMensaje.push('El username de cliente debe tener entre 1 a 50 caracteres.');
            }
            if(this.email){
                let correoValido = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(this.email.value)
                if(!correoValido){
                    this.validaMensaje.push('Debe ingresar un email válido.');
                }
                return console.log(correoValido);
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
                axios.patch(`clientes/actualizar/${this.id}`, {
                    //
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
                    url: 'clientes/crear',
                    data: {
                        'first_name': this.first_name,
                        'last_name': this.last_name,
                        'username': this.username,
                        'direcciones': this.direcciones,
                        'email': this.email,
                        'comuna': this.comuna,
                        'ciudad': this.ciudad
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