---
template: decision-tree-page
slug: /decision-tree
title: Decision Tree Analysis
---
Explore the relationship between teachers' experience and Year 11 NCEA exam results through decision tree analysis.

## Understanding Decision Trees

A decision tree is a machine learning algorithm that makes predictions by learning simple decision rules from data. In this analysis, we examine how teachers' years of teaching experience relates to their students' NCEA exam performance.

## About the Dataset

This analysis uses sample data representing Year 11 NCEA exam results paired with the teaching experience of their teachers. The data includes:

- **Teaching Years**: Number of years the teacher has been teaching
- **Exam Score**: Student's NCEA exam score (0-100)
- **Result**: NCEA grade (Not Achieved, Achieved, Merit, Excellence)

### Kaggle API Integration

In a production environment, this data can be fetched from Kaggle datasets using the **Kaggle API** (@Kaggle/kaggle-api npm package: `kaggle-node`). The following datasets are relevant for this analysis:

**Recommended Kaggle Datasets:**
- Student Performance Dataset
- Teacher Experience and Student Achievement
- Education Quality Indicators
- Academic Performance Factors

**How to integrate Kaggle API:**

1. Install the kaggle-node package (already included in this project)
2. Obtain Kaggle API credentials from your Kaggle account settings
3. Create a `.kaggle/kaggle.json` file with your credentials
4. Use the API to fetch datasets programmatically

See the implementation notes in the page component for technical details on data fetching.

## How to Read the Tree

The decision tree visualization uses **vis.js network** (from https://datastorm-open.github.io/visNetwork/tree.html) to display an interactive decision tree. The tree splits the data at key thresholds of teaching experience. Each branch represents a decision based on the teacher's years of experience, leading to predictions about expected student performance levels.

**Interactive Features:**
- Click on nodes to view detailed information
- Zoom and pan to explore the tree structure
- Blue ellipses represent decision nodes
- Green boxes represent prediction (leaf) nodes
