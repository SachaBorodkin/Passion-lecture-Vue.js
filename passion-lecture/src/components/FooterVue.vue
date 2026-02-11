<template>
  <footer class="main-footer">
    <div class="footer-container">
      
      <div class="footer-left">
        <div class="logo">
    <img src="../assets/logo.svg" />
        </div>
        <p class="copyright">©2026 - toutes les droits réservés</p>
      </div>

      <div class="footer-right">
        <h3 class="team-title">Equipe:</h3>
        <ul class="team-list">
          <li v-for="member in team" :key="member.name">
            <span class="member-name">{{ member.name }} :</span>
            <a :href="'mailto:' + member.email" class="mail-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
            </a>
          </li>
        </ul>
      </div>

    </div>
  </footer>
</template>

<script setup>
const team = [
  { name: 'Borodkin Oleksandr', email: 'alex@example.com' },
  { name: 'Kiril Bormin', email: 'kiril@example.com' },
  { name: 'Damien Chabal', email: 'damien@example.com' }
]
</script>
<style>
/* ASTUCE : Ce bloc n'est pas "scoped". 
  Il force ton application à prendre toute la hauteur de l'écran 
  pour que le "margin-top: auto" du footer fonctionne, 
  sans que tu aies à ouvrir App.vue.
*/
#app {
  display: flex !important;
  flex-direction: column !important;
  min-height: 100vh !important;
}
</style>
<style scoped>
/* Import des polices pour correspondre au header */
@import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Jaldi:wght@400;700&display=swap');

.main-footer {
  /* C'est cette ligne qui fait tout le travail : */
  margin-top: auto; 
  
  background-color: #0f172a; /* Même couleur que ton header */
  color: white;
  padding: 30px 50px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #1e293b;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

/* Style du Logo */
.logo {
  font-family: 'Jaldi', sans-serif;
  font-size: 36px;
  font-weight: bold;
}
.logo-only { color: white; }
.logo-books { 
  color: #1c4d3f; /* Le vert foncé de ton image */
  font-family: serif; 
  margin-left: 5px;
}

.copyright {
  font-family: 'Jaldi', sans-serif;
  font-size: 14px;
  color: #94a3b8;
  margin-top: 5px;
}

/* Section Equipe */
.footer-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.team-title {
  font-family: 'Jaldi', sans-serif;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.team-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.team-list li {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 5px;
}

.member-name {
  font-family: 'Jaldi', sans-serif;
  font-size: 15px;
  color: #cbd5e1;
}

.mail-link {
  color: #cbd5e1;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}

.mail-link:hover {
  color: #1c4d3f;
}

/* Ajustement pour mobile */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  .footer-right { align-items: center; }
  .team-list li { justify-content: center; }
}
</style>