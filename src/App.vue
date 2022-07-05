<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-light bg-light">
      <div class="container">
         <h1>Scale calculator 2022</h1>
         <div>
           <!-- <RouterLink to="/">Home</RouterLink>
           <RouterLink to="/about">About</RouterLink> -->
         </div>
       </div>
    </nav>
  </header>

  <div class="mt-2">
    <RouterView />
  </div>
</template>
