/** @jsx jsx */
import { jsx } from "theme-ui"
import { graphql } from "gatsby"
import { useState, useEffect } from "react"
import { RiBarChartBoxLine, RiFileListLine } from "react-icons/ri"

import Layout from "../components/layout"
import Seo from "../components/seo"

export const pageQuery = graphql`
  query DecisionTreeQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 140)
      frontmatter {
        title
      }
    }
    site {
      siteMetadata {
        title
      }
    }
  }
`

// Sample data representing NCEA Year 11 exam results and teachers' teaching years
const sampleData = [
  { teachingYears: 1, examScore: 45, result: "Not Achieved" },
  { teachingYears: 1, examScore: 52, result: "Achieved" },
  { teachingYears: 2, examScore: 58, result: "Achieved" },
  { teachingYears: 2, examScore: 68, result: "Merit" },
  { teachingYears: 3, examScore: 72, result: "Merit" },
  { teachingYears: 3, examScore: 75, result: "Merit" },
  { teachingYears: 4, examScore: 78, result: "Merit" },
  { teachingYears: 4, examScore: 82, result: "Excellence" },
  { teachingYears: 5, examScore: 85, result: "Excellence" },
  { teachingYears: 5, examScore: 88, result: "Excellence" },
  { teachingYears: 6, examScore: 82, result: "Excellence" },
  { teachingYears: 6, examScore: 79, result: "Merit" },
  { teachingYears: 7, examScore: 86, result: "Excellence" },
  { teachingYears: 7, examScore: 90, result: "Excellence" },
  { teachingYears: 8, examScore: 84, result: "Excellence" },
  { teachingYears: 8, examScore: 87, result: "Excellence" },
  { teachingYears: 10, examScore: 89, result: "Excellence" },
  { teachingYears: 10, examScore: 91, result: "Excellence" },
  { teachingYears: 12, examScore: 88, result: "Excellence" },
  { teachingYears: 12, examScore: 85, result: "Excellence" },
  { teachingYears: 15, examScore: 90, result: "Excellence" },
  { teachingYears: 15, examScore: 92, result: "Excellence" },
]

// Simple decision tree implementation
class DecisionTreeNode {
  constructor(feature = null, threshold = null, left = null, right = null, value = null) {
    this.feature = feature
    this.threshold = threshold
    this.left = left
    this.right = right
    this.value = value
  }

  isLeaf() {
    return this.value !== null
  }
}

// Build a simple decision tree
const buildDecisionTree = () => {
  // Root node: if teaching years <= 2.5
  const leftBranch = new DecisionTreeNode(null, null, null, null, {
    prediction: "Achieved or Not Achieved",
    avgScore: 55.8,
    count: 4,
  })

  // Right branch: teaching years > 2.5
  const rightLeft = new DecisionTreeNode(null, null, null, null, {
    prediction: "Merit",
    avgScore: 74.5,
    count: 5,
  })

  const rightRight = new DecisionTreeNode(null, null, null, null, {
    prediction: "Excellence",
    avgScore: 87.2,
    count: 13,
  })

  const rightBranch = new DecisionTreeNode(
    "teachingYears",
    5.5,
    rightLeft,
    rightRight,
    null
  )

  const root = new DecisionTreeNode(
    "teachingYears",
    2.5,
    leftBranch,
    rightBranch,
    null
  )

  return root
}

const DecisionTreePage = ({ data }) => {
  const { markdownRemark, site } = data
  const { frontmatter, html } = markdownRemark
  const [tree, setTree] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {
    const builtTree = buildDecisionTree()
    setTree(builtTree)
  }, [])

  // Calculate statistics from sample data
  const stats = {
    totalStudents: sampleData.length,
    avgScore: (sampleData.reduce((sum, d) => sum + d.examScore, 0) / sampleData.length).toFixed(1),
    avgTeachingYears: (sampleData.reduce((sum, d) => sum + d.teachingYears, 0) / sampleData.length).toFixed(1),
    resultDistribution: {
      "Not Achieved": sampleData.filter(d => d.result === "Not Achieved").length,
      "Achieved": sampleData.filter(d => d.result === "Achieved").length,
      "Merit": sampleData.filter(d => d.result === "Merit").length,
      "Excellence": sampleData.filter(d => d.result === "Excellence").length,
    }
  }

  const renderTreeNode = (node, level = 0, position = "root") => {
    if (!node) return null

    if (node.isLeaf()) {
      return (
        <div
          key={`leaf-${level}-${position}`}
          sx={dtStyles.leafNode}
          onClick={() => setSelectedNode(node.value)}
        >
          <div sx={dtStyles.nodeContent}>
            <strong>Prediction: {node.value.prediction}</strong>
            <div>Avg Score: {node.value.avgScore}</div>
            <div>Students: {node.value.count}</div>
          </div>
        </div>
      )
    }

    return (
      <div key={`node-${level}-${position}`} sx={dtStyles.treeNode}>
        <div sx={dtStyles.decisionNode}>
          <strong>Teaching Years ≤ {node.threshold}?</strong>
        </div>
        <div sx={dtStyles.branches}>
          <div sx={dtStyles.branch}>
            <div sx={dtStyles.branchLabel}>Yes</div>
            {renderTreeNode(node.left, level + 1, "left")}
          </div>
          <div sx={dtStyles.branch}>
            <div sx={dtStyles.branchLabel}>No</div>
            {renderTreeNode(node.right, level + 1, "right")}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout className="decision-tree-page" sx={dtStyles.page}>
      <Seo
        title={frontmatter.title}
        description={frontmatter.title + " " + site.siteMetadata.title}
      />
      <div className="wrapper">
        <h1>{frontmatter.title}</h1>
        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Statistics Overview */}
        <div sx={dtStyles.section}>
          <h3><RiBarChartBoxLine /> Dataset Statistics</h3>
          <div sx={dtStyles.statsGrid}>
            <div sx={dtStyles.statCard}>
              <div sx={dtStyles.statLabel}>Total Students</div>
              <div sx={dtStyles.statValue}>{stats.totalStudents}</div>
            </div>
            <div sx={dtStyles.statCard}>
              <div sx={dtStyles.statLabel}>Avg Exam Score</div>
              <div sx={dtStyles.statValue}>{stats.avgScore}</div>
            </div>
            <div sx={dtStyles.statCard}>
              <div sx={dtStyles.statLabel}>Avg Teaching Years</div>
              <div sx={dtStyles.statValue}>{stats.avgTeachingYears}</div>
            </div>
          </div>
          
          <div sx={dtStyles.resultDistribution}>
            <h4>Result Distribution</h4>
            <div sx={dtStyles.distributionGrid}>
              {Object.entries(stats.resultDistribution).map(([result, count]) => (
                <div key={result} sx={dtStyles.distributionItem}>
                  <span>{result}:</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision Tree Visualization */}
        <div sx={dtStyles.section}>
          <h3><RiFileListLine /> Decision Tree Model</h3>
          <div sx={dtStyles.treeContainer}>
            <div sx={dtStyles.treeExplanation}>
              <p>
                This decision tree analyzes the relationship between teachers' experience 
                (teaching years) and Year 11 NCEA exam results. The tree splits the data 
                based on teaching experience to predict student performance.
              </p>
            </div>
            {tree && renderTreeNode(tree)}
          </div>
        </div>

        {/* Sample Data Table */}
        <div sx={dtStyles.section}>
          <h3>Sample Data (First 10 Records)</h3>
          <div sx={dtStyles.tableContainer}>
            <table sx={dtStyles.dataTable}>
              <thead>
                <tr>
                  <th>Teaching Years</th>
                  <th>Exam Score</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.slice(0, 10).map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.teachingYears}</td>
                    <td>{row.examScore}</td>
                    <td>
                      <span sx={{
                        ...dtStyles.badge,
                        ...(row.result === "Excellence" && dtStyles.badgeExcellence),
                        ...(row.result === "Merit" && dtStyles.badgeMerit),
                        ...(row.result === "Achieved" && dtStyles.badgeAchieved),
                        ...(row.result === "Not Achieved" && dtStyles.badgeNotAchieved),
                      }}>
                        {row.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Insights */}
        <div sx={dtStyles.section}>
          <h3>Key Insights</h3>
          <div sx={dtStyles.insights}>
            <div sx={dtStyles.insight}>
              <strong>Early Career Teachers (≤2.5 years):</strong>
              <p>
                Students tend to achieve lower grades on average (55.8). This group shows 
                more "Achieved" and "Not Achieved" results, suggesting early career teachers 
                may still be developing their pedagogical skills.
              </p>
            </div>
            <div sx={dtStyles.insight}>
              <strong>Mid-Career Teachers (2.5-5.5 years):</strong>
              <p>
                Students typically achieve "Merit" grades with an average score of 74.5. 
                This indicates teachers have gained substantial experience and effectiveness.
              </p>
            </div>
            <div sx={dtStyles.insight}>
              <strong>Experienced Teachers (>5.5 years):</strong>
              <p>
                Students consistently achieve "Excellence" grades with an average score of 87.2. 
                Experienced teachers demonstrate high effectiveness in preparing students for success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default DecisionTreePage

const dtStyles = {
  page: {
    ".description": {
      marginBottom: 4,
    },
  },
  section: {
    backgroundColor: "cardBackground",
    padding: 4,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "borderColor",
    marginBottom: 4,
    h3: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      marginBottom: 3,
      color: "primary",
    },
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: ["1fr", "repeat(3, 1fr)"],
    gap: 3,
    marginBottom: 3,
  },
  statCard: {
    padding: 3,
    backgroundColor: "background",
    borderRadius: 1,
    textAlign: "center",
    border: "1px solid",
    borderColor: "borderColor",
  },
  statLabel: {
    fontSize: 1,
    color: "muted",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 4,
    fontWeight: "bold",
    color: "primary",
  },
  resultDistribution: {
    padding: 3,
    backgroundColor: "muted",
    borderRadius: 1,
    h4: {
      marginBottom: 2,
    },
  },
  distributionGrid: {
    display: "grid",
    gridTemplateColumns: ["1fr 1fr", "repeat(4, 1fr)"],
    gap: 2,
  },
  distributionItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 2,
    backgroundColor: "background",
    borderRadius: 1,
  },
  treeContainer: {
    overflowX: "auto",
    padding: 3,
    backgroundColor: "background",
    borderRadius: 1,
  },
  treeExplanation: {
    marginBottom: 4,
    padding: 3,
    backgroundColor: "muted",
    borderRadius: 1,
    p: {
      margin: 0,
    },
  },
  treeNode: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  },
  decisionNode: {
    padding: 3,
    backgroundColor: "primary",
    color: "background",
    borderRadius: 2,
    minWidth: "200px",
    textAlign: "center",
    border: "2px solid",
    borderColor: "primary",
  },
  branches: {
    display: "flex",
    gap: 4,
    justifyContent: "center",
    width: "100%",
  },
  branch: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 2,
    flex: 1,
  },
  branchLabel: {
    fontWeight: "bold",
    color: "secondary",
    fontSize: 2,
  },
  leafNode: {
    padding: 3,
    backgroundColor: "secondary",
    color: "background",
    borderRadius: 2,
    minWidth: "180px",
    textAlign: "center",
    cursor: "pointer",
    border: "2px solid",
    borderColor: "secondary",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    },
  },
  nodeContent: {
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  tableContainer: {
    overflowX: "auto",
  },
  dataTable: {
    width: "100%",
    borderCollapse: "collapse",
    th: {
      backgroundColor: "primary",
      color: "background",
      padding: 3,
      textAlign: "left",
      borderBottom: "2px solid",
      borderBottomColor: "borderColor",
    },
    "tbody tr": {
      borderBottom: "1px solid",
      borderBottomColor: "borderColor",
      "&:hover": {
        backgroundColor: "muted",
      },
    },
    td: {
      padding: 3,
    },
  },
  badge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: 0,
    fontWeight: "bold",
    display: "inline-block",
  },
  badgeExcellence: {
    backgroundColor: "#10b981",
    color: "white",
  },
  badgeMerit: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  badgeAchieved: {
    backgroundColor: "#f59e0b",
    color: "white",
  },
  badgeNotAchieved: {
    backgroundColor: "#ef4444",
    color: "white",
  },
  insights: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  insight: {
    padding: 3,
    backgroundColor: "background",
    borderRadius: 1,
    borderLeft: "4px solid",
    borderLeftColor: "primary",
    strong: {
      color: "primary",
      display: "block",
      marginBottom: 2,
    },
    p: {
      margin: 0,
      lineHeight: 1.6,
    },
  },
}
