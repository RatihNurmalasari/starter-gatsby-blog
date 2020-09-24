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
  OptimizelyExperiment,
} from '@optimizely/react-sdk';

const optimizely = createInstance({
  sdkKey: 'KQLqMLV5WzeVGeQPm8vf2',
  datafileOptions: {
    updateInterval: 1000,
    autoUpdate: true,
    urlTemplate: 'https://cdn.optimizely.com/datafiles/KQLqMLV5WzeVGeQPm8vf2.json',
  }
})

function ButtonVar(props) {
  var IdEntities = props.post.cartButton.meta[props.variation];
  var valueEntries = "";
  var self = this;
  var a = client.getEntry(IdEntities);
  console.log("KOKOK = ",a)
  function onClick(event) {
    props.optimizely.track('Event_Clicks');
  }

  return (
    <button onClick={onClick} style={{ height: '50px', width:'100%', background:"Red" }}>
      Purchase
    </button>
  )
}
function ButtonVar1(props) {

}
const WrappedButtonVar = withOptimizely(ButtonVar)
var contentful = require('contentful');
var client = contentful.createClient({
  space: 'jvlr7xlhiu9o',
  accessToken: 'GPJfuob009Z4A_sp76T1JmL5y2HLwbuPAXjStDjvuTU',
  host:'preview.contentful.com'
})
class BlogPostTemplate extends React.Component {
  render() {
    const post = get(this.props, 'data.contentfulBlogPost')
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    return (
      <Layout location={this.props.location}>

        <p>${post.cartButton.meta['variation_2']}</p>
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
            <OptimizelyExperiment experiment="discount_test">
              {variation => <WrappedButtonVar variation={variation} post={post}/>}
            </OptimizelyExperiment>
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
      cartButton {
        experimentTitle
        experimentId
        meta {
          variation_1
          variation_2
        }
        experimentKey
      }
    }
  }
`
