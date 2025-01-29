<template>
  <div class="menu">
    <ul>
      <li>
        <router-link to="/inicio">Inicio</router-link>
      </li>
      <li>
        <router-link to="/TableConsultation">Historias clinicas</router-link>
      </li>
    
    </ul>
  </div>
</template>

<style>
.menu {
  background-color:rgb(131, 185, 255);
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  color: #0a0202;
}

.menu li {
  display: inline-block;
}

.menu li a {
  display: block;
  padding: 14px 16px;
  text-decoration: none;
  font-weight: bold;
}

.menu li a:hover {
  background-color: #fff;
}

.menu li.router-link-active a {
  background-color: #0a0202;
}

.menu li.router-link-active a:hover {
  background-color: #ccc;
}
</style>
