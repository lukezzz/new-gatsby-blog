/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/node-apis/
 */

// You can delete this file if you're not using it
const { createFilePath } = require(`gatsby-source-filesystem`)
const path = require(`path`)

exports.onCreateNode = ({ node, getNode, actions }) => {
    // console.log(node.internal.type)
    const { createNodeField } = actions
    if (node.internal.type === `MarkdownRemark`) {
        const slug = createFilePath({ node, getNode })

        createNodeField({
            node,
            name: `slug`,
            value: slug
        })
    }
}

exports.createPages = ({ graphql, actions }) => {
    const { createPage } = actions
    return graphql(`
    {
        allMarkdownRemark(sort: {fields: [frontmatter___date], order: DESC}) {
          totalCount
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
      
    `).then(reuslt => {
        reuslt.data.allMarkdownRemark.edges.forEach(({ node }) => {
            createPage({
                path: node.fields.slug,
                component: path.resolve(`./src/templates/blog-post.js`),
                context: {
                    slug: node.fields.slug
                }
            })
        })
    })
}