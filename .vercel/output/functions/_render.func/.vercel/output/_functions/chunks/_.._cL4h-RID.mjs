export { renderers } from '../renderers.mjs';

const page = () => import('./prerender_C4_Dvldt.mjs').then(n => n.h);

export { page };
