document.addEventListener('DOMContentLoaded', function() {
  const sidebar = document.getElementById('sidebar');
  const menuIcon = document.getElementById('menuIcon');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  // Toggle sidebar when clicking on the menu icon
  menuIcon.addEventListener('click', function() {
    sidebar.classList.toggle('open');
  });

  // Hide sidebar when clicking the close button
  sidebarCloseBtn.addEventListener('click', function() {
    sidebar.classList.remove('open');
  });
});











///*
//// JavaScript to toggle the sidebar menu
//function toggleMenu() {
//    var sidebar = document.querySelector('.sidebar');
//    if (sidebar.style.display === "block") {
//        sidebar.style.display = "none";
//    } else {
//        sidebar.style.display = "block";
//    }
//}
//*/
//// JavaScript to toggle the sidebar menu and change icon color
//function toggleMenu() {
//    var sidebar = document.querySelector('.sidebar');
//    sidebar.classList.toggle('open');
//}
