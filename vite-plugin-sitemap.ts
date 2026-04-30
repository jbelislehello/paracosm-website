import type { Plugin, ViteDevServer } from "vite";

/**
 * Vite plugin that emits sitemap.xml from the route registry.
 *
 * - Dev: serves /sitemap.xml dynamically via middleware.
 * - Build: writes dist/sitemap.xml as a build asset.
 *
 * The sitemap module is loaded through Vite's SSR pipeline so the
 * `@/` alias and TypeScript work without extra build config.
 */
export function sitemapPlugin(): Plugin {
  let devServer: ViteDevServer | undefined;

  const loadSitemap = async (
    loader: (id: string) => Promise<Record<string, unknown>>,
  ): Promise<string> => {
    const mod = (await loader("/src/lib/sitemap.ts")) as {
      buildSitemapXml: (opts?: { host?: string }) => string;
    };
    return mod.buildSitemapXml();
  };

  return {
    name: "paracosm-sitemap",
    apply: () => true,

    configureServer(server) {
      devServer = server;
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();
        const url = req.url.split("?")[0];
        if (url !== "/sitemap.xml") return next();
        try {
          const xml = await loadSitemap((id) => server.ssrLoadModule(id));
          res.setHeader("Content-Type", "application/xml; charset=utf-8");
          res.setHeader("Cache-Control", "no-store");
          res.end(xml);
        } catch (err) {
          // Surface errors clearly in dev rather than 500-ing silently
          // eslint-disable-next-line no-console
          console.error("[sitemap] failed to generate:", err);
          res.statusCode = 500;
          res.end("Failed to generate sitemap");
        }
      });
    },

    async generateBundle() {
      // Spin up a one-shot SSR-capable server to load the TS module
      // through the same Vite resolution used in dev.
      const { createServer } = await import("vite");
      const server = await createServer({
        configFile: false,
        server: { middlewareMode: true },
        appType: "custom",
        logLevel: "silent",
      });
      try {
        const xml = await loadSitemap((id) => server.ssrLoadModule(id));
        this.emitFile({
          type: "asset",
          fileName: "sitemap.xml",
          source: xml,
        });
      } finally {
        await server.close();
      }
    },

    closeBundle() {
      // No-op; devServer cleanup is handled by Vite itself.
      void devServer;
    },
  };
}

export default sitemapPlugin;
