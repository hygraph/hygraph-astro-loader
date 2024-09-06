import { defineCollection, z } from 'astro:content';
import { HygraphLoader } from '../../../dist/index.js';



const pages = defineCollection({
    loader: HygraphLoader({
        endpoint: 'https://us-east-1-shared-usea1-02.cdn.hygraph.com/content/cm03uw79i05w906w9h5gj195p/master',
        operation: 'pages',
        fields: ["id", "title", "slug", { "body": ["text"] }],
    }),
    schema: z.object({
        id: z.string(),
        title: z.string({ required_error: 'Title is required' }).min(1, { message: 'Title is required to be at least 1 character' } ),
        slug: z.string(),
        body: z.object({
            text: z.string(),
        }),
    })})



    export const collections = { pages };