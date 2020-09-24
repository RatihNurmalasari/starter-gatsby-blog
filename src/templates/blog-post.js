import React from 'react'
import { graphql } from 'gatsby'
import { Helmet } from 'react-helmet'
import get from 'lodash/get'
import Img from 'gatsby-image'
import Layout from '../components/layout'
import heroStyles from '../components/hero.module.css'
import {
  createInstance,
  OptimizelyProvider,
  OptimizelyFeature,
  withOptimizely,
  OptimizelyExperiment,
} from '@optimizely/react-sdk';
import $ from 'jquery';

const optimizely = createInstance({
  sdkKey: 'KQLqMLV5WzeVGeQPm8vf2',
  datafileOptions: {
    updateInterval: 1000,
    autoUpdate: true,
    urlTemplate: 'https://cdn.optimizely.com/datafiles/KQLqMLV5WzeVGeQPm8vf2.json',
  }
})

function ButtonVar(props) {
  if(!props.post.cartButton){
    return (null);
  }
  var IdEntities = props.post.cartButton.meta[props.variation];
  client.getEntry(IdEntities).then((response) => {
    // output the author name
    var valueEntry = response.fields.cartButtonColorVariance;
    $(".button-cta").css({"height":"50px", "width":"100%","background":valueEntry});
  })
  function onClick(event) {
    props.optimizely.track('Event_Clicks');
  }

  return (
    <button className="button-cta" onClick={onClick}>
      Purchase
    </button>
  )
}

const WrappedButtonVar = withOptimizely(ButtonVar)
var contentful = require('contentful');
var contentfulConfig = {
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  host: process.env.CONTENTFUL_HOST
};
var client = contentful.createClient(contentfulConfig)
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
