<template>
<v-layout align-start>
    <v-flex>
        <v-data-table :headers="headers" :items="fabricas" :search="search" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Fábricas</v-toolbar-title>
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
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nueva Fábrica</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="nombre" label="Nombre de la Fábrica"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="telefono" label="Teléfono de la fábrica (Sin guión)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="cantidad_proveida" label="Cantidad de artículos que provee"></v-text-field>
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
                                Activar Fábrica
                            </v-card-title>
                            <v-card-title primary-title class="headline" v-if="adAccion == 0">
                                Desactivar Fábrica
                            </v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion == 1"> ACTIVAR</span>
                                <span v-if="adAccion == 0"> DESACTIVAR</span> a la fábrica: {{adNombre}}
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
                <template v-if="item.fabrica_principal == true">
                    <v-icon small @click="activarDesactivarMostrar(0, item)">block</v-icon>
                </template>
                <template v-else>
                    <v-icon small @click="activarDesactivarMostrar(1, item)">check</v-icon>
                </template>

                <div v-if="item.fabrica_principal == true">
                    <span class="blue--text">Principal</span>
                </div>
                <div v-else>
                    <span class="red--text">Secundaria</span>
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
        fabricas: [],
        headers: [
            { text: 'No.', value: 'id', sortable: true },
            { text: 'Nombre', value: 'nombre', sortable: true },
            { text: 'Teléfono', value: 'telefono', sortable: false },
            { text: 'Cantidad de artículos que provee', value: 'cantidad_proveida', sortable: false },
            { text: 'Opciones', value: 'actions', sortable: true },
        ],
        editedIndex: -1,
        id: '',
        nombre: '',
        telefono: '',
        cantidad_proveida: '',
        fabrica_principal: '',
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
            axios.get('fabricas/',{headers: {
                'Authorization': `Token ${this.$store.state.token}`
            }})
            .then((response)=>{
                cat.fabricas = response.data;
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        editItem (item) {
            this.id = item.id;
            this.nombre = item.nombre;
            this.telefono = item.telefono;
            this.cantidad_proveida = item.cantidad_proveida,
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
            axios.patch(`fabricas/${this.adId}/`, {
                'fabrica_principal': true,
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
            axios.patch(`fabricas/${this.adId}/`, {
                'fabrica_principal': false,
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
            this.id = '';
            this.nombre = '',
            this.telefono = '',
            this.cantidad_proveida = '',
            this.fabrica_principal = '',
            this.valida = 0;
            this.validaMensaje = [];
            this.editedIndex = -1;
        },

        validar(){
            let num = 0;
            let cant = 0;
            this.valida = 0;
            this.validaMensaje = [];
            if (this.nombre.length < 1 || this.nombre.length > 50) {
                this.validaMensaje.push('El nombre de la fábrica debe tener entre 1 a 50 caracteres.');
            }
            num = parseInt(this.telefono);
            cant = parseInt(this.cantidad_proveida);

            if (isNaN(num) || isNaN(cant)) {
                this.validaMensaje.push('La calle o la cantidad que se provee debe estar escrita con un número.');
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
                axios.patch(`fabricas/${this.id}`, {
                    'nombre': this.nombre,
                    'telefono': this.telefono,
                    'cantidad_proveida': this.cantidad_proveida,
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
                    url: 'fabricas/',
                    data: {
                        'nombre': this.nombre,
                        'telefono': this.telefono,
                        'cantidad_proveida': this.cantidad_proveida,
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