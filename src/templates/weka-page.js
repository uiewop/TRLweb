/** @jsx jsx */
import { jsx } from "theme-ui"
import { graphql } from "gatsby"
import { useState } from "react"
import { RiUploadLine, RiPlayLine, RiDownloadLine, RiFileTextLine } from "react-icons/ri"

import Layout from "../components/layout"
import Seo from "../components/seo"

export const pageQuery = graphql`
  query WekaQuery($id: String!) {
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

const WekaPage = ({ data }) => {
  const { markdownRemark, site } = data
  const { frontmatter, html } = markdownRemark

  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState(null)

  const algorithms = [
    { value: "j48", label: "J48 Decision Tree", category: "Classification" },
    { value: "naivebayes", label: "Naive Bayes", category: "Classification" },
    { value: "svm", label: "Support Vector Machine", category: "Classification" },
    { value: "kmeans", label: "K-Means Clustering", category: "Clustering" },
    { value: "dbscan", label: "DBSCAN", category: "Clustering" },
    { value: "apriori", label: "Apriori Association Rules", category: "Association" },
  ]

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && (file.name.endsWith('.csv') || file.name.endsWith('.arff'))) {
      setSelectedFile(file)
      setResults(null)
    } else {
      alert('Please upload a CSV or ARFF file')
    }
  }

  const handleAnalysis = async () => {
    if (!selectedFile || !selectedAlgorithm) {
      alert('Please upload a file and select an algorithm')
      return
    }

    setIsProcessing(true)
    
    // Simulate processing time for demo
    setTimeout(() => {
      setResults({
        algorithm: selectedAlgorithm,
        fileName: selectedFile.name,
        summary: `Analysis completed using ${algorithms.find(a => a.value === selectedAlgorithm)?.label}`,
        details: [
          "Dataset loaded successfully",
          "Preprocessing completed",
          "Model training finished", 
          "Evaluation metrics calculated"
        ],
        metrics: {
          accuracy: "85.3%",
          precision: "82.1%", 
          recall: "87.9%",
          f1Score: "84.9%"
        }
      })
      setIsProcessing(false)
    }, 3000)
  }

  const categorizedAlgorithms = algorithms.reduce((acc, alg) => {
    if (!acc[alg.category]) acc[alg.category] = []
    acc[alg.category].push(alg)
    return acc
  }, {})

  return (
    <Layout className="weka-page" sx={wekaStyles.wekaPage}>
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
        
        <div sx={wekaStyles.wekaInterface}>
          
          {/* File Upload Section */}
          <div sx={wekaStyles.section}>
            <h3><RiUploadLine /> Upload Dataset</h3>
            <div sx={wekaStyles.uploadArea}>
              <input
                type="file"
                accept=".csv,.arff"
                onChange={handleFileUpload}
                sx={wekaStyles.fileInput}
                id="file-upload"
              />
              <label htmlFor="file-upload" sx={wekaStyles.uploadLabel}>
                <RiFileTextLine sx={wekaStyles.uploadIcon} />
                {selectedFile ? selectedFile.name : "Choose CSV or ARFF file"}
              </label>
            </div>
          </div>

          {/* Algorithm Selection */}
          <div sx={wekaStyles.section}>
            <h3><RiPlayLine /> Select Algorithm</h3>
            <div sx={wekaStyles.algorithmGrid}>
              {Object.entries(categorizedAlgorithms).map(([category, algs]) => (
                <div key={category} sx={wekaStyles.categoryGroup}>
                  <h4 sx={wekaStyles.categoryTitle}>{category}</h4>
                  {algs.map(algorithm => (
                    <label key={algorithm.value} sx={wekaStyles.algorithmOption}>
                      <input
                        type="radio"
                        name="algorithm"
                        value={algorithm.value}
                        checked={selectedAlgorithm === algorithm.value}
                        onChange={(e) => setSelectedAlgorithm(e.target.value)}
                      />
                      <span>{algorithm.label}</span>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Button */}
          <div sx={wekaStyles.section}>
            <button
              onClick={handleAnalysis}
              disabled={!selectedFile || !selectedAlgorithm || isProcessing}
              sx={wekaStyles.analyzeButton}
            >
              {isProcessing ? "Processing..." : "Run Analysis"}
              <RiPlayLine />
            </button>
          </div>

          {/* Results Section */}
          {results && (
            <div sx={wekaStyles.section}>
              <h3><RiDownloadLine /> Results</h3>
              <div sx={wekaStyles.resultsContainer}>
                <div sx={wekaStyles.resultSummary}>
                  <h4>Analysis Summary</h4>
                  <p><strong>File:</strong> {results.fileName}</p>
                  <p><strong>Algorithm:</strong> {results.summary}</p>
                </div>
                
                <div sx={wekaStyles.resultDetails}>
                  <h4>Process Details</h4>
                  <ul>
                    {results.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>

                <div sx={wekaStyles.resultMetrics}>
                  <h4>Performance Metrics</h4>
                  <div sx={wekaStyles.metricsGrid}>
                    {Object.entries(results.metrics).map(([key, value]) => (
                      <div key={key} sx={wekaStyles.metricItem}>
                        <span sx={wekaStyles.metricLabel}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </span>
                        <span sx={wekaStyles.metricValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default WekaPage

const wekaStyles = {
  wekaPage: {
    ".description": {
      marginBottom: 4,
    },
  },
  wekaInterface: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  section: {
    backgroundColor: "cardBackground",
    padding: 4,
    borderRadius: 2,
    border: "1px solid",
    borderColor: "borderColor",
    h3: {
      display: "flex",
      alignItems: "center",
      gap: 2,
      marginBottom: 3,
      color: "primary",
    },
  },
  uploadArea: {
    position: "relative",
  },
  fileInput: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  uploadLabel: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: 3,
    border: "2px dashed",
    borderColor: "primary",
    borderRadius: 2,
    backgroundColor: "background",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "muted",
      borderColor: "secondary",
    },
  },
  uploadIcon: {
    fontSize: 3,
    color: "primary",
  },
  algorithmGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 3,
  },
  categoryGroup: {
    border: "1px solid",
    borderColor: "borderColor",
    borderRadius: 1,
    padding: 3,
  },
  categoryTitle: {
    marginBottom: 2,
    color: "secondary",
    fontSize: 2,
  },
  algorithmOption: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: 2,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "muted",
    },
    input: {
      marginRight: 2,
    },
  },
  analyzeButton: {
    display: "flex",
    alignItems: "center",
    gap: 2,
    padding: 3,
    backgroundColor: "primary",
    color: "background",
    border: "none",
    borderRadius: 2,
    cursor: "pointer",
    fontSize: 2,
    fontWeight: "bold",
    transition: "all 0.3s ease",
    "&:hover:not(:disabled)": {
      backgroundColor: "secondary",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  resultsContainer: {
    display: "grid",
    gap: 3,
  },
  resultSummary: {
    padding: 3,
    backgroundColor: "muted",
    borderRadius: 1,
  },
  resultDetails: {
    ul: {
      listStyle: "none",
      padding: 0,
      li: {
        padding: 1,
        marginBottom: 1,
        backgroundColor: "background",
        borderLeft: "3px solid",
        borderLeftColor: "primary",
        paddingLeft: 3,
      },
    },
  },
  resultMetrics: {
    border: "1px solid",
    borderColor: "primary",
    borderRadius: 1,
    padding: 3,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 2,
  },
  metricItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 2,
    backgroundColor: "background",
    borderRadius: 1,
  },
  metricLabel: {
    fontSize: 1,
    color: "muted",
    marginBottom: 1,
  },
  metricValue: {
    fontSize: 3,
    fontWeight: "bold",
    color: "primary",
  },
}