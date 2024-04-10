import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import './chunks/astro_BUZmonMA.mjs';
import 'clsx';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"en/about-us/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/about-us","isIndex":false,"type":"page","pattern":"^\\/en\\/about-us\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"about-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/about-us.astro","pathname":"/en/about-us","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/blog","isIndex":false,"type":"page","pattern":"^\\/en\\/blog\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/blog.astro","pathname":"/en/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/contact","isIndex":false,"type":"page","pattern":"^\\/en\\/contact\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/contact.astro","pathname":"/en/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/join-us/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/join-us","isIndex":false,"type":"page","pattern":"^\\/en\\/join-us\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"join-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/join-us.astro","pathname":"/en/join-us","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/what-we-do/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/what-we-do","isIndex":false,"type":"page","pattern":"^\\/en\\/what-we-do\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"what-we-do","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/what-we-do.astro","pathname":"/en/what-we-do","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en","isIndex":true,"type":"page","pattern":"^\\/en\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/index.astro","pathname":"/en","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/blog","isIndex":false,"type":"page","pattern":"^\\/es\\/blog\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/blog.astro","pathname":"/es/blog","prerender":true,"fallbackRoutes":[{"route":"/en/blog","isIndex":false,"type":"fallback","pattern":"^\\/en\\/blog\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/blog.astro","pathname":"/en/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/contacto","isIndex":false,"type":"page","pattern":"^\\/es\\/contacto\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/contacto.astro","pathname":"/es/contacto","prerender":true,"fallbackRoutes":[{"route":"/en/contacto","isIndex":false,"type":"fallback","pattern":"^\\/en\\/contacto\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/contacto.astro","pathname":"/en/contacto","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/nosotros/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/nosotros","isIndex":false,"type":"page","pattern":"^\\/es\\/nosotros\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/nosotros.astro","pathname":"/es/nosotros","prerender":true,"fallbackRoutes":[{"route":"/en/nosotros","isIndex":false,"type":"fallback","pattern":"^\\/en\\/nosotros\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/nosotros.astro","pathname":"/en/nosotros","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/que-hacemos/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/que-hacemos","isIndex":false,"type":"page","pattern":"^\\/es\\/que-hacemos\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"que-hacemos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/que-hacemos.astro","pathname":"/es/que-hacemos","prerender":true,"fallbackRoutes":[{"route":"/en/que-hacemos","isIndex":false,"type":"fallback","pattern":"^\\/en\\/que-hacemos\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"que-hacemos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/que-hacemos.astro","pathname":"/en/que-hacemos","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/sumate/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/sumate","isIndex":false,"type":"page","pattern":"^\\/es\\/sumate\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"sumate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/sumate.astro","pathname":"/es/sumate","prerender":true,"fallbackRoutes":[{"route":"/en/sumate","isIndex":false,"type":"fallback","pattern":"^\\/en\\/sumate\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"sumate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/sumate.astro","pathname":"/en/sumate","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es","isIndex":true,"type":"page","pattern":"^\\/es\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/index.astro","pathname":"/es","prerender":true,"fallbackRoutes":[{"route":"/en","isIndex":true,"type":"fallback","pattern":"^\\/en\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/index.astro","pathname":"/en","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[{"route":"/","isIndex":true,"type":"fallback","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"fallback","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[{"route":"/","isIndex":true,"type":"fallback","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BIe0mclZ.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/[lang]/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/about-us.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/blog.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/contact.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/join-us.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/what-we-do.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/blog.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/contacto.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/nosotros.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/que-hacemos.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/sumate.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[lang]/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/en/blog@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/es/blog@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-manifest":"manifest_BTyLrWbn.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_CQRPTjVI.mjs","\u0000@astro-page:src/pages/en/about-us@_@astro":"chunks/about-us_kx68pD8B.mjs","\u0000@astro-page:src/pages/en/blog@_@astro":"chunks/blog_DDEfLC6N.mjs","\u0000@astro-page:src/pages/en/contact@_@astro":"chunks/contact_DHnLcDZZ.mjs","\u0000@astro-page:src/pages/en/join-us@_@astro":"chunks/join-us_Loq71oLg.mjs","\u0000@astro-page:src/pages/en/what-we-do@_@astro":"chunks/what-we-do_C3M1UEqJ.mjs","\u0000@astro-page:src/pages/en/index@_@astro":"chunks/index_ab3fu5YF.mjs","\u0000@astro-page:src/pages/es/blog@_@astro":"chunks/blog_CYa6VoZt.mjs","\u0000@astro-page:src/pages/es/contacto@_@astro":"chunks/contacto_DmZnAf75.mjs","\u0000@astro-page:src/pages/es/nosotros@_@astro":"chunks/nosotros_UxomQFxE.mjs","\u0000@astro-page:src/pages/es/que-hacemos@_@astro":"chunks/que-hacemos_BuEoBETh.mjs","\u0000@astro-page:src/pages/es/sumate@_@astro":"chunks/sumate_D-X6yyHY.mjs","\u0000@astro-page:src/pages/es/index@_@astro":"chunks/index_BR8QTigT.mjs","\u0000@astro-page:src/pages/[lang]/blog/[...slug]@_@astro":"chunks/_.._owfmS4Br.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_zxQEHVwN.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post.md?astroContentCollectionEntry=true":"chunks/post_BSkrTa99.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/nota.md?astroContentCollectionEntry=true":"chunks/nota_Ct3jOcr5.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post.md?astroPropagatedAssets":"chunks/post_DSyCA0Xp.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/nota.md?astroPropagatedAssets":"chunks/nota_hokAqgMj.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post.md":"chunks/post_V7fI97jv.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/nota.md":"chunks/nota_XZFsnQEb.mjs","@astrojs/react/client.js":"_astro/client.CwqMovxS.js","/astro/hoisted.js?q=0":"_astro/hoisted.DMVnj1Ks.js","astro:scripts/page.js":"_astro/page.BIe0mclZ.js","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/components/slider-home":"_astro/slider-home.9NUjoIsq.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/fgeNewLogo.ChHWFhFr.svg","/_astro/_slug_.BQnz2up_.css","/favicon.svg","/_astro/client.CwqMovxS.js","/_astro/hoisted.DMVnj1Ks.js","/_astro/index.PHf5fhiH.js","/_astro/page.BIe0mclZ.js","/_astro/slider-home.9NUjoIsq.js","/images/slider01.jpg","/_astro/page.BIe0mclZ.js","/en/about-us/index.html","/en/blog/index.html","/en/contact/index.html","/en/join-us/index.html","/en/what-we-do/index.html","/en/index.html","/es/blog/index.html","/es/contacto/index.html","/es/nosotros/index.html","/es/que-hacemos/index.html","/es/sumate/index.html","/es/index.html","/index.html","/index.html"],"i18n":{"fallback":{"en":"es"},"strategy":"pathname-prefix-always","locales":["es","en"],"defaultLocale":"es","domainLookupTable":{}},"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
