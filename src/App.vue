<template>
<!-- Todo el código HTML -->
<v-app id="app">
    <!-- Navegador lateral -->
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list dense>
        <template>
          <!-- Botón de home -->
          <v-list-item :to="{name: 'Home'}">
            <v-list-item-action>
              <v-icon>home</v-icon>
            </v-list-item-action>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item>
          <!-- Fin botón de home -->
        </template>

        <template>
        <!-- Listado agrupado de Almacén -->
          <v-list-group>
            <!-- Botón Principal Almacén -->
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Almacén
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin botón principal Almacén -->
            <!-- Categorías -->
            <v-list-item :to="{name: 'Categoria'}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Categorías
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin categorías -->
            <!-- Artículos -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Artículos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Artículos -->
          <!-- Fin listado agrupado de Almacén -->
          </v-list-group>
        </template>

        <template>
        <!-- Listado agrupado de Compras -->
          <v-list-group>
            <!-- Botón principal Compras -->
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin botón principal Compras -->
            <!-- Ingresos -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ingresos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Ingresos -->
            <!-- Proveedores -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Proveedores
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Proveedores -->
          </v-list-group>
        <!-- Fin de listado agrupado de Compras -->
        </template>

        <template>
        <!-- Listado agrupado de Ventas -->
          <v-list-group>
            <!-- Botón Principal de Ventas -->
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin botón principal de Ventas -->
            <!-- Ventas -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Ventas -->
            <!-- Clientes -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Clientes
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Clientes -->
          </v-list-group>
        <!-- Fin listado agrupado de Ventas -->
        </template>

        <template>
        <!-- Listado agrupado de Accesos -->
          <v-list-group>
            <!-- Botón principal de Accesos -->
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Accesos
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin botón principal de accesos -->
            <!-- Usuarios -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Usuarios
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Usuarios -->
          </v-list-group>
        <!-- Fin listado agrupado de Accesos -->
        </template>

        <template>
        <!-- Listado agrupado de Consultas -->
          <v-list-group>
            <!-- Botón principal de Consultas -->
            <v-list-item slot="activator">
              <v-list-item-content>
                <v-list-item-title>
                  Consultas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin botón principal de Consultas -->
            <!-- Consulta Compras -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Compras
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Consulta Compras -->
            <!-- Consulta Ventas -->
            <v-list-item :to="{name: ''}">
              <v-list-item-action>
                <v-icon>table_chart</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  Consulta Ventas
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <!-- Fin Consulta Ventas -->
          </v-list-group>
        <!-- Fin de listado agrupado de Consultas -->
        </template>

      </v-list>
    </v-navigation-drawer>
    <!-- Fin del navegador lateral -->

    <!-- Barra superior -->
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="orange darken-3"
      dark
    >
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-3"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <span class="hidden-sm-and-down">Sistema FronTienda</span>
      </v-toolbar-title>      
      <v-spacer></v-spacer>
      <v-btn icon :to="{name: 'Login'}">
        <v-icon>login</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>
    <!-- Fin barra superior -->

    <!-- Contenido -->
    <v-main>
      <v-container
        fluid
        fill-height
      >
        <v-slide-y-transition mode="out-in">
          <router-view/>
        </v-slide-y-transition>
      </v-container>
    </v-main>
    <!-- Fin Contenido -->

    <!-- Footer -->
    <v-footer  height="auto">
      <v-layout justify-center>
        <v-flex text-xs-center>
          <v-card flat tile color="light-blue accent-4" class="text-center">
            <v-card-text class="white--text font-italic">
              Ingeniería en Sistemas | Ricardo Fuentes &copy; {{new Date().getFullYear()}}
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-footer>
    <!-- Fin del Footer -->

  </v-app>
</template>

<script>
//Todo el código JS
//import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    //HelloWorld,
  },

  data: () => ({
    //
    drawer: null
  }),
};
</script>
