import fs from 'fs'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
import type { Plugin } from 'vite'
type ManifestV3 = Exclude<ManifestV3Export, Promise<unknown> | ((...args: unknown[]) => unknown)>

// https://github.com/crxjs/chrome-extension-tools/issues/918
export const patchDynamicUrlsInBuildBundlePlugin = (): Plugin => ({
  name: 'patch-dynamic-urls-plugin-in-build-bundle',
  writeBundle() {
    const manifestPath = 'dist/manifest.json'
    const manifestContent: ManifestV3 = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

    if (manifestContent.web_accessible_resources) {
      manifestContent.web_accessible_resources = manifestContent.web_accessible_resources.map(resource => ({
        ...resource,
        use_dynamic_url: false,
      }))
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2))
  },
})
