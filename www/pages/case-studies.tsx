import fs from 'fs'
import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import Head from 'next/head'

import { NextSeo } from 'next-seo'
import { generateRss } from '~/lib/rss'
import { getSortedPosts, getAllCategories } from '~/lib/posts'
import authors from 'lib/authors.json'

import DefaultLayout from '~/components/Layouts/Default'
import { Typography, Badge, Space, Select } from '@supabase/ui'
import PostTypes from '~/types/post'
import BlogListItem from '~/components/Blog/BlogListItem'
import BlogHeader from '~/components/Blog/BlogHeader'
import ImageGrid from '~/components/ImageGrid'

export async function getStaticProps() {
  const allPostsData = getSortedPosts('_case-studies')
  const categories = getAllCategories('_case-studies')
  const rss = generateRss(allPostsData)

  // create a rss feed in public directory
  // rss feed is added via <Head> component in render return
  fs.writeFileSync('./public/case-studies-rss.xml', rss)

  return {
    props: {
      blogs: allPostsData,
      categories,
    },
  }
}

function Blog(props: any) {
  const [category, setCategory] = useState('all')
  const [blogs, setBlogs] = useState(props.blogs)

  const { basePath } = useRouter()

  useEffect(() => {
    // Update the document title using the browser API
    setBlogs(
      category === 'all'
        ? props.blogs
        : props.blogs.filter((post: any) => {
            const found = post.tags.includes(category)
            return found
          })
    )
  }, [category])

  console.log(blogs)

  const caseStudyThumbs = blogs.map((blog: PostTypes, idx: number) => {
    return {
      image: blog.logo,
      name: blog.title,
      link: blog.url,
    }
  })

  // console.log('caseStudyThumbs', caseStudyThumbs)

  return (
    <>
      <Head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title="RSS feed for case studies"
          href={`${basePath}/case-studies-rss.xml`}
        />
      </Head>
      <NextSeo title="Case studies" description="Latest customers using Supabase" />
      <DefaultLayout>
        <div className="bg-white dark:bg-dark-800 overflow-hidden">
          <div className="container mx-auto px-8 sm:px-16 xl:px-20 mt-32">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl mx-auto text-center">
                <Typography.Title level={1}>Case studies</Typography.Title>
                <Typography.Text>
                  <p className="text-xl">
                    Learn how teams behind everyone’s favorite products use Radix to save time,
                    boost quality, and set the bar for accessibility.
                  </p>
                </Typography.Text>
              </div>
              <div className="mt-12 max-w-lg mx-auto grid lg:grid-cols-1 lg:max-w-none">
                <ImageGrid images={caseStudyThumbs} lgCols={4} padding={6} className="h-32" />
              </div>
            </div>
          </div>
        </div>
      </DefaultLayout>
    </>
  )
}

export default Blog