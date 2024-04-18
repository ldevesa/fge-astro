/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

CONDITION_PATHNAME = Astro.url.pathname === `/es/${nuevaURL}` || Astro.url.pathname === `/en/${nuevaURL}`
CONDITION_PATHNAME_2 = Astro.url.pathname === `/es/${actualizarURL(lang)}` || Astro.url.pathname === `/en/${actualizarURL(lang)}`