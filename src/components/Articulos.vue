<template>
<v-layout align-start>
    <v-flex>
        <v-data-table :headers="headers" :items="articulos" :search="search" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Articulos</v-toolbar-title>
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
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Producto</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="nombre" label="Nombre del producto"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="descripcion" label="Descripción"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="precio" label="Precio de venta (En Quetzales)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="categoria" label="Categoría"></v-text-field>
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
                                Activar Categoría
                            </v-card-title>
                            <v-card-title primary-title class="headline" v-if="adAccion == 0">
                                Desactivar Categoría
                            </v-card-title>
                            <v-card-text>
                                Estás a punto de 
                                <span v-if="adAccion == 1"> ACTIVAR</span>
                                <span v-if="adAccion == 0"> DESACTIVAR</span> la categoría {{adNombre}}
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
                <template v-if="item.estado">
                    <v-icon small @click="activarDesactivarMostrar(0, item)">block</v-icon>
                </template>
                <template v-else>
                    <v-icon small @click="activarDesactivarMostrar(1, item)">check</v-icon>
                </template>

                <div v-if="item.estado">
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
        articulos: [],
        headers: [
            { text: 'No.', value: 'id', sortable: true },
            { text: 'Nombre', value: 'nombre', sortable: true },
            { text: 'Descripción', value: 'descripcion', sortable: false },
            { text: 'Precio', value: 'precio', sortable: false },
            { text: 'Fecha de creación', value: 'createdAt', sortable: false },
            { text: 'Categoría', value: 'categoria', sortable: false },
            { text: 'Opciones', value: 'actions', sortable: false },
        ],
        editedIndex: -1,
        id: '',
        nombre: '',
        descripcion: '',
        precio: '',
        estado: '',
        categoria: '',

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
            axios.get('producto/listar',{headers: {
                'Authorization': `Token ${this.$store.state.token}`
            }})
            .then((response)=>{
                cat.articulos = response.data;
            })
            .catch((error)=>{
                console.log(error);
            });
        },

        editItem (item) {
            this.id = item.id;
            this.nombre = item.nombre;
            this.descripcion = item.descripcion;
            this.categoria = item.categoria;
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
            axios.patch(`producto/actualizar/${this.adId}`, {
                'estado': 1,
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
            axios.patch(`producto/actualizar/${this.adId}`, {
                'estado': 0,
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
            this.descripcion = '';
            this.valida = 0;
            this.validaMensaje = [];
            this.editedIndex = -1;
        },

        validar(){
            this.valida = 0;
            this.validaMensaje = [];
            if (this.nombre.length < 1 || this.nombre.length > 50) {
                this.validaMensaje.push('El nombre del artículo debe tener entre 1 a 50 caracteres.');
            }
            if (this.descripcion.length > 255) {
                this.validaMensaje.push('La descripción del artículo no debe tener más de 255 caracteres.');
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
                axios.patch(`producto/actualizar/${this.id}`, {
                    'nombre': this.nombre,
                    'descripcion': this.descripcion,
                    'precio': this.precio,
                    'categoria': this.categoria,
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
                //cat.limpiar();
                axios({
                    method: 'post',
                    url: 'producto/crear',
                    data: {
                        'nombre': this.nombre,
                        'descripcion': this.descripcion,
                        'precio': this.precio,
                        'categoria': this.categoria,
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