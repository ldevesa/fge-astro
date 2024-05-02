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

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"en/about-us/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/about-us","isIndex":false,"type":"page","pattern":"^\\/en\\/about-us\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"about-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/about-us.astro","pathname":"/en/about-us","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/blog","isIndex":false,"type":"page","pattern":"^\\/en\\/blog\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/blog.astro","pathname":"/en/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/contact","isIndex":false,"type":"page","pattern":"^\\/en\\/contact\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/contact.astro","pathname":"/en/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/join-us/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/join-us","isIndex":false,"type":"page","pattern":"^\\/en\\/join-us\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"join-us","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/join-us.astro","pathname":"/en/join-us","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/what-we-do/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en/what-we-do","isIndex":false,"type":"page","pattern":"^\\/en\\/what-we-do\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"what-we-do","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/what-we-do.astro","pathname":"/en/what-we-do","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"en/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/en","isIndex":true,"type":"page","pattern":"^\\/en\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/en/index.astro","pathname":"/en","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/blog/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/blog","isIndex":false,"type":"page","pattern":"^\\/es\\/blog\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/blog.astro","pathname":"/es/blog","prerender":true,"fallbackRoutes":[{"route":"/en/blog","isIndex":false,"type":"fallback","pattern":"^\\/en\\/blog\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"blog","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/blog.astro","pathname":"/en/blog","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/contacto/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/contacto","isIndex":false,"type":"page","pattern":"^\\/es\\/contacto\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/contacto.astro","pathname":"/es/contacto","prerender":true,"fallbackRoutes":[{"route":"/en/contacto","isIndex":false,"type":"fallback","pattern":"^\\/en\\/contacto\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"contacto","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/contacto.astro","pathname":"/en/contacto","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/nosotros/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/nosotros","isIndex":false,"type":"page","pattern":"^\\/es\\/nosotros\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/nosotros.astro","pathname":"/es/nosotros","prerender":true,"fallbackRoutes":[{"route":"/en/nosotros","isIndex":false,"type":"fallback","pattern":"^\\/en\\/nosotros\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"nosotros","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/nosotros.astro","pathname":"/en/nosotros","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/que-hacemos/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/que-hacemos","isIndex":false,"type":"page","pattern":"^\\/es\\/que-hacemos\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"que-hacemos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/que-hacemos.astro","pathname":"/es/que-hacemos","prerender":true,"fallbackRoutes":[{"route":"/en/que-hacemos","isIndex":false,"type":"fallback","pattern":"^\\/en\\/que-hacemos\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"que-hacemos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/que-hacemos.astro","pathname":"/en/que-hacemos","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/sumate/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es/sumate","isIndex":false,"type":"page","pattern":"^\\/es\\/sumate\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}],[{"content":"sumate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/sumate.astro","pathname":"/es/sumate","prerender":true,"fallbackRoutes":[{"route":"/en/sumate","isIndex":false,"type":"fallback","pattern":"^\\/en\\/sumate\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}],[{"content":"sumate","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/sumate.astro","pathname":"/en/sumate","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"es/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/es","isIndex":true,"type":"page","pattern":"^\\/es\\/?$","segments":[[{"content":"es","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/index.astro","pathname":"/es","prerender":true,"fallbackRoutes":[{"route":"/en","isIndex":true,"type":"fallback","pattern":"^\\/en\\/?$","segments":[[{"content":"en","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/es/index.astro","pathname":"/en","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[{"route":"/","isIndex":true,"type":"fallback","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"fallback","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[{"route":"/","isIndex":true,"type":"fallback","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"external","value":"/_astro/page.BIe0mclZ.js"}],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/[lang]/blog/[...slug].astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/about-us.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/contact.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/join-us.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/what-we-do.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/contacto.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/nosotros.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/que-hacemos.astro",{"propagation":"none","containsHead":true}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/sumate.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/components/LastNews.astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/en/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/index.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/es/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/[lang]/blog/[...slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/en/blog.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/en/blog@_@astro",{"propagation":"in-tree","containsHead":false}],["C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/pages/es/blog.astro",{"propagation":"in-tree","containsHead":true}],["\u0000@astro-page:src/pages/es/blog@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-manifest":"manifest_B0PNbl92.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_CQRPTjVI.mjs","\u0000@astro-page:src/pages/en/about-us@_@astro":"chunks/about-us_BhtecRJf.mjs","\u0000@astro-page:src/pages/en/blog@_@astro":"chunks/blog_C5Jj7bNT.mjs","\u0000@astro-page:src/pages/en/contact@_@astro":"chunks/contact_DY21-Ohf.mjs","\u0000@astro-page:src/pages/en/join-us@_@astro":"chunks/join-us_DB6OD4D5.mjs","\u0000@astro-page:src/pages/en/what-we-do@_@astro":"chunks/what-we-do_ClKGqbol.mjs","\u0000@astro-page:src/pages/en/index@_@astro":"chunks/index_CNO-JQdw.mjs","\u0000@astro-page:src/pages/es/blog@_@astro":"chunks/blog_CVVkf1og.mjs","\u0000@astro-page:src/pages/es/contacto@_@astro":"chunks/contacto_CJ9DTwYm.mjs","\u0000@astro-page:src/pages/es/nosotros@_@astro":"chunks/nosotros_ZgSSG0Cy.mjs","\u0000@astro-page:src/pages/es/que-hacemos@_@astro":"chunks/que-hacemos_D0K1-nnv.mjs","\u0000@astro-page:src/pages/es/sumate@_@astro":"chunks/sumate_BBQLsZXp.mjs","\u0000@astro-page:src/pages/es/index@_@astro":"chunks/index_vV6zvk9O.mjs","\u0000@astro-page:src/pages/[lang]/blog/[...slug]@_@astro":"chunks/_.._CIIietnu.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_DJ4XsBhD.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post-1.md?astroContentCollectionEntry=true":"chunks/post-1_C2yrJMNk.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post.md?astroContentCollectionEntry=true":"chunks/post_BSkrTa99.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/post-1.md?astroContentCollectionEntry=true":"chunks/post-1_Di5P8FWQ.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/post.md?astroContentCollectionEntry=true":"chunks/post_LMNH09gL.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post-1.md?astroPropagatedAssets":"chunks/post-1_CeOi5FZW.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post.md?astroPropagatedAssets":"chunks/post_DSyCA0Xp.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/post-1.md?astroPropagatedAssets":"chunks/post-1_C8RYye4S.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/post.md?astroPropagatedAssets":"chunks/post_DMeNLHQD.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post-1.md":"chunks/post-1_-edV4xl4.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/en/post.md":"chunks/post_V7fI97jv.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/post-1.md":"chunks/post-1_p9d0IFsf.mjs","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/content/blog/es/post.md":"chunks/post_B_vMbr-b.mjs","/astro/hoisted.js?q=1":"_astro/hoisted.DunLaW_Q.js","@astrojs/react/client.js":"_astro/client.A3021UZq.js","/astro/hoisted.js?q=2":"_astro/hoisted.C2mrDoZc.js","astro:scripts/page.js":"_astro/page.BIe0mclZ.js","C:/Users/LDEVESA/Documents/Clientes/fge/fge-astro/src/components/slider-home.tsx":"_astro/slider-home.DBIQ0aTt.js","/astro/hoisted.js?q=0":"_astro/hoisted.BuDU1_O4.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/fgeNewLogo.ChHWFhFr.svg","/_astro/_slug_.CtUboX-d.css","/favicon.svg","/images/coin11.webp","/images/corazones.svg","/images/slider01.jpg","/images/slider02.jpg","/images/splash.svg","/_astro/client.A3021UZq.js","/_astro/hoisted.BuDU1_O4.js","/_astro/hoisted.C2mrDoZc.js","/_astro/hoisted.DunLaW_Q.js","/_astro/index.DzVPoKsz.js","/_astro/page.BIe0mclZ.js","/_astro/slider-home.DBIQ0aTt.js","/pagefind/pagefind-entry.json","/pagefind/pagefind-highlight.js","/pagefind/pagefind-modular-ui.css","/pagefind/pagefind-modular-ui.js","/pagefind/pagefind-ui.css","/pagefind/pagefind-ui.js","/pagefind/pagefind.en_13d0eeb869.pf_meta","/pagefind/pagefind.en_3b5b5ef95a.pf_meta","/pagefind/pagefind.en_3d5bad8f9d.pf_meta","/pagefind/pagefind.en_535e8d5799.pf_meta","/pagefind/pagefind.en_658628672b.pf_meta","/pagefind/pagefind.en_6e22147420.pf_meta","/pagefind/pagefind.en_77a4c37734.pf_meta","/pagefind/pagefind.en_aabaf6eab6.pf_meta","/pagefind/pagefind.en_b3743687ac.pf_meta","/pagefind/pagefind.en_b761371495.pf_meta","/pagefind/pagefind.en_ca611b23b4.pf_meta","/pagefind/pagefind.en_cc217decb0.pf_meta","/pagefind/pagefind.en_d42c5c175d.pf_meta","/pagefind/pagefind.en_d72554a24b.pf_meta","/pagefind/pagefind.en_e68b9d1ddf.pf_meta","/pagefind/pagefind.es_2e1efa5ee2.pf_meta","/pagefind/pagefind.es_388e333a34.pf_meta","/pagefind/pagefind.es_38fbc99545.pf_meta","/pagefind/pagefind.es_3fdc209510.pf_meta","/pagefind/pagefind.es_5db85fe7ad.pf_meta","/pagefind/pagefind.es_73b69a10f3.pf_meta","/pagefind/pagefind.es_778251bafa.pf_meta","/pagefind/pagefind.es_8a42862d47.pf_meta","/pagefind/pagefind.es_8db33ecf68.pf_meta","/pagefind/pagefind.es_95d5bfe12b.pf_meta","/pagefind/pagefind.es_b9438ae258.pf_meta","/pagefind/pagefind.es_c43486daeb.pf_meta","/pagefind/pagefind.es_cb47d52dc2.pf_meta","/pagefind/pagefind.es_cbff811a6b.pf_meta","/pagefind/pagefind.es_f21a177e25.pf_meta","/pagefind/pagefind.js","/pagefind/wasm.en.pagefind","/pagefind/wasm.es.pagefind","/pagefind/wasm.unknown.pagefind","/images/scrollbox/Asistencia-Alimentaria.jpg","/images/scrollbox/espacios-con-valores.jpg","/images/scrollbox/Formalizamos.jpg","/images/scrollbox/Referentes-al-Frente.jpg","/images/scrollbox/Una-Vuelta.jpg","/pagefind/index/en_2c6a54f.pf_index","/pagefind/index/en_7033269.pf_index","/pagefind/index/en_88e9292.pf_index","/pagefind/index/en_9d42a5a.pf_index","/pagefind/index/en_a57dab7.pf_index","/pagefind/index/en_bd1a08e.pf_index","/pagefind/index/en_c18bb05.pf_index","/pagefind/index/en_c453ad9.pf_index","/pagefind/index/es_1c51167.pf_index","/pagefind/index/es_7557bb7.pf_index","/pagefind/index/es_7ae4bd1.pf_index","/pagefind/index/es_ad404ba.pf_index","/pagefind/index/es_ccbc10b.pf_index","/pagefind/index/es_e2621fa.pf_index","/pagefind/index/es_ea17ccf.pf_index","/pagefind/fragment/en_16d5166.pf_fragment","/pagefind/fragment/en_1717456.pf_fragment","/pagefind/fragment/en_174a7d5.pf_fragment","/pagefind/fragment/en_1ec461f.pf_fragment","/pagefind/fragment/en_2e888ec.pf_fragment","/pagefind/fragment/en_318cc0f.pf_fragment","/pagefind/fragment/en_3fa256d.pf_fragment","/pagefind/fragment/en_4764251.pf_fragment","/pagefind/fragment/en_4fe168b.pf_fragment","/pagefind/fragment/en_57cefe1.pf_fragment","/pagefind/fragment/en_5ae6b53.pf_fragment","/pagefind/fragment/en_5afaf2f.pf_fragment","/pagefind/fragment/en_5f4a36a.pf_fragment","/pagefind/fragment/en_7835d69.pf_fragment","/pagefind/fragment/en_791fcca.pf_fragment","/pagefind/fragment/en_7a81cdd.pf_fragment","/pagefind/fragment/en_8e7f1fd.pf_fragment","/pagefind/fragment/en_975a84c.pf_fragment","/pagefind/fragment/en_98a92e5.pf_fragment","/pagefind/fragment/en_a0a3aa2.pf_fragment","/pagefind/fragment/en_abe0d26.pf_fragment","/pagefind/fragment/en_b56f90f.pf_fragment","/pagefind/fragment/en_bae2d48.pf_fragment","/pagefind/fragment/en_bf2dfbb.pf_fragment","/pagefind/fragment/en_cb7416a.pf_fragment","/pagefind/fragment/en_ce26c49.pf_fragment","/pagefind/fragment/en_d0d8c24.pf_fragment","/pagefind/fragment/en_fdd1c3c.pf_fragment","/pagefind/fragment/es_074256b.pf_fragment","/pagefind/fragment/es_0997545.pf_fragment","/pagefind/fragment/es_1264703.pf_fragment","/pagefind/fragment/es_38731b8.pf_fragment","/pagefind/fragment/es_397153b.pf_fragment","/pagefind/fragment/es_3ad2d79.pf_fragment","/pagefind/fragment/es_438f843.pf_fragment","/pagefind/fragment/es_5213a0d.pf_fragment","/pagefind/fragment/es_585db73.pf_fragment","/pagefind/fragment/es_5b7eadc.pf_fragment","/pagefind/fragment/es_5eb2a29.pf_fragment","/pagefind/fragment/es_67d22a3.pf_fragment","/pagefind/fragment/es_727b2bd.pf_fragment","/pagefind/fragment/es_72e3c81.pf_fragment","/pagefind/fragment/es_7838ffa.pf_fragment","/pagefind/fragment/es_788db77.pf_fragment","/pagefind/fragment/es_7dc9923.pf_fragment","/pagefind/fragment/es_7f2c2d4.pf_fragment","/pagefind/fragment/es_8375e86.pf_fragment","/pagefind/fragment/es_8a2fd4f.pf_fragment","/pagefind/fragment/es_9f17611.pf_fragment","/pagefind/fragment/es_b197b1d.pf_fragment","/pagefind/fragment/es_ba8908b.pf_fragment","/pagefind/fragment/es_bcadecc.pf_fragment","/pagefind/fragment/es_e2889ef.pf_fragment","/pagefind/fragment/es_e815e7d.pf_fragment","/pagefind/fragment/es_e9b1d5a.pf_fragment","/pagefind/fragment/es_f023242.pf_fragment","/_astro/page.BIe0mclZ.js","/en/about-us/index.html","/en/blog/index.html","/en/contact/index.html","/en/join-us/index.html","/en/what-we-do/index.html","/en/index.html","/es/blog/index.html","/es/contacto/index.html","/es/nosotros/index.html","/es/que-hacemos/index.html","/es/sumate/index.html","/es/index.html","/index.html","/index.html"],"i18n":{"fallback":{"en":"es"},"strategy":"pathname-prefix-always","locales":["es","en"],"defaultLocale":"es","domainLookupTable":{}},"buildFormat":"directory"});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
