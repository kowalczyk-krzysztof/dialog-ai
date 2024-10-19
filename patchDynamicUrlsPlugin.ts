import fs from 'fs'
import type { ManifestV3Export } from '@crxjs/vite-plugin'
type ManifestV3 = Exclude<ManifestV3Export, Promise<any> | ((...args: any[]) => any)>

// https://github.com/crxjs/chrome-extension-tools/issues/918
export const patchDynamicUrlsPlugin = {
  name: 'patch-dynamic-urls-plugin',
  writeBundle() {
    const manifestPath = 'dist/manifest.json'
    const manifestContent: ManifestV3 = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

    if (manifestContent.web_accessible_resources) {
      manifestContent.web_accessible_resources = manifestContent.web_accessible_resources.map((resource) => ({
        ...resource,
        use_dynamic_url: false,
      }))
    }

    fs.writeFileSync(manifestPath, JSON.stringify(manifestContent, null, 2))
  },
}
