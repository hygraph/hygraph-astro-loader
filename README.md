# Hygraph Astro Content Loader

_Beta build of this project. Please report any issues._

A package to add a Hygraph loader to your Astro project. For more information on Astro Content Loaders, see the [Astro's deep dive on Content Loaders](https://astro.build/blog/content-layer-deep-dive/).

## Installation
```bash
npm install @hygraph/hygraph-astro-loader
```

## Usage

Before using the loader, you need to set up or collect the follwing from your Hygraph project:

- API Endpoint (configured through your project settings)
  - For testing, we recommend initializing your Public Content API and using the endpoint provided.
- If you don't have a Public Content API, but instead have a regular endpoint, you'll need to create a Permanent Access Token for the API and use that in your loader's optional `token` property.

Once that's done, you're ready to set things up in Astro.

In your `/content` directory, add a `config.ts` file if it doesn't already exist with the following content:

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
| `richText` | Optional identifier for your Rich Text field to render HTML. Requires the `html` string from your Rich Text data. | _optional_ |

Validating the schema is optional, but recommended. The schema is used to validate the data returned from the API. Use Zod to define the schema of what you expect from the API.

## Rendering Rich Text

If you're using a Rich Text field in your Hygraph project, you can use the `richText` property to render the HTML in your Astro project. 

```ts
const pages = defineCollection({
    loader: HygraphLoader({
        endpoint: 'MY_API_ENDPOINT',
        operation: 'pages',
        fields: ["id", "title", "slug", { "body": ["html"] }],
        richText: 'body',
    }),
    schema: z.object({
        id: z.string(),
        title: z.string({ required_error: 'Title is required' }).min(1, { message: 'Title is required to be at least 1 character' } ),
        slug: z.string(),
        body: z.object({
            html: z.string(),
        }),
    })})
```

This will send the HTML to Astro's `<Content />` component to render the HTML.

```astro
---
import { getEntry } from 'astro:content';
import Layout from '../../layouts/Layout.astro';
import { getCollection, render } from 'astro:content';
export async function getStaticPaths() {
	const posts = await getCollection('pages');
	return posts.map((post) => ({
		params: { slug: post.data.slug },
		props: post,
	}));
}

const post = await getEntry('pages', Astro.props.id)
const { Content } = await render(post);
---

<Layout title="">
    <h1>{post.data.title}</h1>
    <Content />
</Layout>
```

## Want to test but don't have a Hygraph project?

Use one of these starters to get started with Hygraph and Astro:

- [Hygraph Commerce Astro Starter](https://hygraph.com/marketplace/starters/skncre-starter-astro)
- [Hygraph Microblog Astro Starter](https://hygraph.com/marketplace/starters/astro-microblog)
