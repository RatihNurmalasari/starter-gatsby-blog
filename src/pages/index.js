import React from 'react'
import { graphql } from 'gatsby'
import get from 'lodash/get'
import { Helmet } from 'react-helmet'
import Hero from '../components/hero'
import Layout from '../components/layout'
import ArticlePreview from '../components/article-preview'
import '../components/base.css'
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

class RootIndex extends React.Component {
  
  render() {
    const posts = get(this, 'props.data.allContentfulBlogPost.edges')
    const [author] = get(this, 'props.data.allContentfulPerson.edges')
    return (
      <Layout location={this.props.location}>
        <div style={{ background: '#fff' }}>
          <Helmet title="Simplisafe Site">
            <meta name="description" content="This is site Simplisafe" />
          </Helmet>
          <Hero data={author.node} />
          <div className="wrapper">
            <h2 className="section-headline">Product</h2>
            <ul className="article-list">
              {posts.map(({ node }) => {
                return (
                  <li key={node.slug}>
                    <ArticlePreview article={node} />
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
        <OptimizelyProvider
            optimizely={optimizely}
            user={{ id: Math.random().toString()}}
          >
            <OptimizelyFeature autoUpdate={true} feature="discount">
              { (isEnabled, variables) => (
                isEnabled
                  ? <pre >{`[DEBUG: Feature ON] ${variables.amount}` } <WrappedButton /></pre>
                  : <pre >{`[DEBUG: Feature OFF] Daily deal: A bluetooth speaker for $99!` } <WrappedButton /></pre>
              )}
            </OptimizelyFeature>
        </OptimizelyProvider>
      </Layout>
    )
  }
}

function Button(props) {
  function onClick(event) {
    props.optimizely.track('Event_Clicks');
  }

  return (
    <button onClick={onClick}>
      Purchase
    </button>
  )
}

const WrappedButton = withOptimizely(Button)


export default RootIndex

export const pageQuery = graphql`
  query HomeQuery {
    allContentfulBlogPost(filter: {node_locale: {eq: "en-US"}}) {
      edges {
        node {
          title
          slug
          publishDate(formatString: "MMMM Do, YYYY")
          tags
          heroImage {
            fluid(maxWidth: 350, maxHeight: 196, resizingBehavior: SCALE) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
          description {
            childMarkdownRemark {
              html
            }
          }
        }
      }
    }
    allContentfulPerson(
      filter: { contentful_id: { eq: "15jwOBqpxqSAOy2eOO4S0m" } }
    ) {
      edges {
        node {
          name
          shortBio {
            shortBio
          }
          title
          heroImage: image {
            fluid(
              maxWidth: 1180
              maxHeight: 480
              resizingBehavior: PAD
              background: "rgb:000000"
            ) {
              ...GatsbyContentfulFluid_tracedSVG
            }
          }
        }
      }
    }
  }
`
