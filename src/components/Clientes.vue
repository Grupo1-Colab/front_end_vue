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
                                            <v-text-field v-model="nombre" label="Nombre y Apellido del Cliente"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="saldo" label="Saldo actual (Q)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="credito_limite" label="Crédito límite del cliente (Q)"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="no_calle" label="Número de Calle"></v-text-field>
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
                                <span v-if="adAccion == 0"> DESACTIVAR</span> al usuario: {{adNombre}}
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
            { text: 'Nombre', value: 'nombre', sortable: true },
            { text: 'Saldo', value: 'saldo', sortable: false },
            { text: 'Crédito límite', value: 'credito_limite', sortable: false },
            { text: 'Número de Calle', value: 'no_calle', sortable: false },
            { text: 'Comuna', value: 'comuna', sortable: false },
            { text: 'Ciudad', value: 'ciudad', sortable: true },
        ],
        editedIndex: -1,
        id: '',
        nombre: '',
        saldo: '',
        credito_limite: '',
        no_calle: '',
        comuna: '',
        ciudad: '',
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
            axios.get('clientes/',{headers: {
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
            this.nombre = '',
            this.saldo = '',
            this.credito_limite = '',
            this.no_calle = '',
            this.comuna = '',
            this.ciudad = '',
            this.valida = 0;
            this.validaMensaje = [];
            this.editedIndex = -1;
        },

        validar(){
            let num = 0;
            this.valida = 0;
            this.validaMensaje = [];
            if (this.nombre.length < 1 || this.nombre.length > 50) {
                this.validaMensaje.push('El nombre del usuario debe tener entre 1 a 50 caracteres.');
            }
            if (this.saldo > this.credito_limite) {
                this.validaMensaje.push('El saldo no puede ser superior al crédito');
            }
            if (this.credito_limite > 30000) {
                this.validaMensaje.push('Se ha sobrepasado la capacidad de crédito del cliente.');
            }
            num = parseInt(this.no_calle)
            if (isNaN(num)) {
                this.validaMensaje.push('La calle debe estar escrita con un número.');
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
                axios.patch(`clientes/${this.id}`, {
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
                    url: 'clientes/',
                    data: {
                        'nombre': this.nombre,
                        'saldo': this.saldo,
                        'credito_limite': this.credito_limite,
                        'direcciones': this.direcciones,
                        'no_calle': this.no_calle,
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