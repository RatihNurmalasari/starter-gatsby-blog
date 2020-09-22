import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'

import heroStyles from '../components/hero.module.css'
import blogpostStyles from '../templates/blog-post.module.css'
import {
  createInstance,
  OptimizelyProvider,
  OptimizelyFeature,
  withOptimizely,
} from '@optimizely/react-sdk';

const optimizely = createInstance({
  sdkKey: 'KQLqMLV5WzeVGeQPm8vf2',
  datafileOptions: {
    updateInterval: 1000,
    autoUpdate: true,
    urlTemplate: 'https://cdn.optimizely.com/datafiles/KQLqMLV5WzeVGeQPm8vf2.json',
  }
})

function ButtonVar1(props) {
  function onClick(event) {
    props.optimizely.track('Event_Clicks');
  }

  return (
    <button onClick={onClick} style={{ height: '50px', width:'100%', background:"Red" }}>
      Purchase
    </button>
  )
}

function ButtonVar2(props) {
  function onClick(event) {
    props.optimizely.track('Event_Clicks');
    alert("Thanks For Click")
  }

  return (
    <button onClick={onClick} style={{ height: '50px', width:'100%', background:"Blue" }}>
      Purchase
    </button>
  )
}

const WrappedButtonVar1 = withOptimizely(ButtonVar1)
const WrappedButtonVar2 = withOptimizely(ButtonVar2)
class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')

    return (
      <Layout location={this.props.location}>
        <div style={{ background: '#fff' }}>
          <Helmet title={`${post.title} | ${siteTitle}`} />
          <div className={heroStyles.hero}>
            <Img
              className={heroStyles.heroImage}
              alt={post.title}
              fluid={post.heroImage.fluid}
            />
          </div>
          <div className="wrapper">
            <h1 className="section-headline">{post.title}</h1>
            <p
              style={{
                display: 'block',
              }}
            >
              {post.publishDate}
            </p>
            <div
              dangerouslySetInnerHTML={{
                __html: post.body.childMarkdownRemark.html,
              }}
            />
          </div>
        </div>
        <OptimizelyProvider
            optimizely={optimizely}
            user={{ id: Math.random().toString()}}
          >
            <OptimizelyFeature autoUpdate={true} feature="discount">
              { (isEnabled, variables) => (
                isEnabled
                  ? variables.amount == 6 ?<WrappedButtonVar1 /> :<WrappedButtonVar2 />
                  : <pre >{`[DEBUG: Feature OFF] `}</pre>
              )}
            </OptimizelyFeature>
        </OptimizelyProvider>
      </Layout>
    )
  }
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    contentfulBlogPost(slug: { eq: $slug }) {
      title
      publishDate(formatString: "MMMM Do, YYYY")
      heroImage {
        fluid(maxWidth: 1180, background: "rgb:000000") {
          ...GatsbyContentfulFluid_tracedSVG
        }
      }
      body {
        childMarkdownRemark {
          html
        }
      }
    }
  }
`
