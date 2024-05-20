gsap.registerPlugin(ScrollTrigger);
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProgressBar from 'progressbar.js';

// Ejecutar la función setupSidebar() cada vez que ocurre una transición de página
document.addEventListener('astro:page-load', () => {

    const details = gsap.utils.toArray(".desktopContentSection:not(:first-child)");
    const photos = gsap.utils.toArray(".desktopPhoto:not(:first-child)");
    //console.log('photos', photos);
    gsap.set(photos, {yPercent: 100, autoAlpha: 0});

    const allPhotos = gsap.utils.toArray(".desktopPhoto");
    //console.log('AllPhotos', allPhotos);

    // create
    let mm = gsap.matchMedia();

    // add a media query. When it matches, the associated function will run
    mm.add("(min-width: 720px)", () => {

        // this setup code only runs when viewport is at least 720px wide
        //console.log("desktop")
        
        ScrollTrigger.create({
            trigger:"#gallery",
            start:"top 70px",
            end:"bottom bottom",
            pin:"#right",
        })

        details.forEach((detail, index) => {
            console.log('forEach', index);
            let headline = detail.querySelector("h2");
            let animation = gsap.timeline()
                .to(photos[index], { yPercent: 0, autoAlpha: 1, duration: 0.8 }) // Muestra la nueva imagen con desvanecimiento
                .to(allPhotos[index], { autoAlpha: 0, duration: 0.5 }, 0.8); // Oculta la imagen anterior después de 0.5 segundos

            ScrollTrigger.create({
                trigger: headline,
                start: "top 80%",
                end: "top 30%",
                animation: animation,
                scrub: true,
                markers: true
            });
        });

        
        return () => { // optional
        // custom cleanup code here (runs when it STOPS matching)
        console.log("mobile")
        };
    });

});

// ==========================================================================
 // Función para crear una barra de progreso
//@ts-ignore
function createProgressBar(containerId, endValue, ratioValue, nameValue ) {
    const container = document.getElementById(containerId);

    var bar = new ProgressBar.Circle(container, {
        color: '#fff',
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: null,
        text: {
            autoStyleContainer: false
        },
        from: { color: '#aaa' },
        to: { color: '#ec4899' },
        // Set default step function for all animate calls
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);

            var value = Math.round(circle.value() * ratioValue);
            if (value === 0) {
                circle.setText('');
            } else {
                circle.setText('<p style="font-weight: bold;">' + formatNumber(value) + '</p>' + '<p style="font-size: .8rem;">' + nameValue + '</p>');
            }

        }
    });

    //bar.animate(1.0);  // Number from 0.0 to 1.0
    // Animar la barra de progreso al 0% al principio
    bar.set(0);

    // Crear un ScrollTrigger para animar la barra de progreso con el desplazamiento
    ScrollTrigger.create({
        trigger: container, // Contenedor de referencia para el desplazamiento
        start: "top 80%", // Iniciar la animación cuando el 80% superior del contenedor está en la vista
        end: "bottom 20%", // Finalizar la animación cuando el 20% inferior del contenedor está en la vista
        onEnter: function() {
            bar.animate(endValue); // Animar la barra de progreso al 100% al entrar
        },
        onLeaveBack: function() {
            bar.animate(0.0); // Reiniciar la animación de la barra de progreso al 0% al salir
        }
    });

}


    createProgressBar('progress1', 1.0, 21, 'OSC');
    createProgressBar('progress2', 1.0, 2625, 'Familias alcanzadas');
    createProgressBar('progress3', 1.0, 10500, 'Cantidad de personas beneficiadas');
    createProgressBar('progress4', 1.0, 4019, 'Kilos de alimentos donados');



//@ts-ignore
function formatNumber(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}