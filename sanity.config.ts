import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'harry-ferraro-studio',
  title: 'Harry Ferraro — Studio CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Artworks')
              .schemaType('artwork')
              .child(S.documentTypeList('artwork').title('All Artworks')),
            S.listItem()
              .title('Series')
              .schemaType('series')
              .child(S.documentTypeList('series').title('All Series')),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  basePath: '/studio',
})
