# Hygraph Astro Content Loader

_Alpha build of this project. Please report any issues._

A package to add a Hygraph loader to your Astro project. For more information on Astro Content Loaders, see the [4.14 Release notes](https://astro.build/blog/astro-4140/).

## Installation
(not yet on NPM)
```bash
npm install @hygraph/astro-content-loader
```

## Usage

Add the following to your `astro.config.mjs`:

```js
experimental: {
    contentLayer: true
}
```

Then, in your `/content` directory, add a `config.ts` file with the following content:

```ts
import { HygraphLoader } from '@hygraph/astro-content-loader';


const pages = defineCollection({
    loader: HygraphLoader({
        endpoint: 'MY_API_ENDPOINT',
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
```

The pages collection will now be available in your Astro project. It can be accessed both as data in frontmatter, but also to create pages or respond to params.

```astro
---
import { getCollection } from 'astro:content';
export async function getStaticPaths() {
    const pages = await getCollection('pages');
    return pages.map(page => ({
        params: { slug: page.slug },
        props: { page },
    }));
}
const { page } = Astro.props;---
---

<h1>{page.title}</h1>
<div>{page.body.text}</div>
```

## Options

| Property | Description | Required |
| --- | --- | ---|
| `endpoint` | The endpoint of your Hygraph API. | _required_ |
| `operation` | The operation to perform on the API. (listed in Hygraph as Plural API ID) | _required_ |
| `fields` | Array fields to fetch from the API. | _required_ |
| `token` | Optional token to pass to the API. | _optional_ |
| `variables` | Optional variables to pass to the GraphQL API | _optional_ |

Validating the schema is optional, but recommended. The schema is used to validate the data returned from the API. Use Zod to define the schema of what you expect from the API.

