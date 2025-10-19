function mostrar(id) {
    document.querySelectorAll('.formulario').forEach(f => f.style.display = 'none');
    document.getElementById(id).style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}