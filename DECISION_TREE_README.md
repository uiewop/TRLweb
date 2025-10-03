# Decision Tree Visualization with Kaggle API Integration

This project implements an interactive decision tree visualization using vis.js network and includes integration with the Kaggle API for fetching real-world student performance datasets.

## Features

### 1. Interactive Decision Tree Visualization
- **Library Used**: vis.js network (from https://datastorm-open.github.io/visNetwork/tree.html)
- **Implementation**: `src/templates/decision-tree-page.js`
- **Features**:
  - Interactive hierarchical layout
  - Click-to-explore node details
  - Zoom and pan controls
  - Color-coded nodes (blue for decisions, green for predictions)
  - Responsive design

### 2. Kaggle API Integration
- **Package**: kaggle-node
- **Purpose**: Fetch real-world student performance and teacher information datasets
- **Example Implementation**: `src/util/kaggle-api-example.js`

## Installation

The required dependencies are already included in `package.json`:

```bash
npm install
```

Key dependencies:
- `vis-network`: ^9.1.9 - For decision tree visualization
- `kaggle-node`: ^1.1.2 - For Kaggle API integration

## Usage

### Viewing the Decision Tree

1. Build the project:
```bash
npm run build
```

2. Serve the built site:
```bash
npm run serve
```

3. Navigate to: `http://localhost:9000/decision-tree`

### Integrating Kaggle API

#### Step 1: Get Kaggle API Credentials

1. Create a Kaggle account at https://www.kaggle.com
2. Go to https://www.kaggle.com/account
3. Scroll to "API" section and click "Create New API Token"
4. Download `kaggle.json` file

#### Step 2: Configure Credentials

Option A: File-based (for local development)
```bash
mkdir -p ~/.kaggle
mv ~/Downloads/kaggle.json ~/.kaggle/
chmod 600 ~/.kaggle/kaggle.json
```

Option B: Environment variables (recommended for production)
```bash
export KAGGLE_USERNAME="your_username"
export KAGGLE_KEY="your_api_key"
```

#### Step 3: Implement Data Fetching

See `src/util/kaggle-api-example.js` for complete implementation examples.

Basic usage:
```javascript
const { fetchStudentPerformanceData } = require('./src/util/kaggle-api-example');

async function loadData() {
  const data = await fetchStudentPerformanceData();
  // Process data for decision tree...
}
```

### Recommended Kaggle Datasets

1. **Student Performance Data Set**
   - URL: https://www.kaggle.com/datasets/larsen0966/student-performance-data-set
   - Contains: Student grades, demographics, social factors

2. **Students Performance in Exams**
   - URL: https://www.kaggle.com/datasets/spscientist/students-performance-in-exams
   - Contains: Test scores, parental education, lunch type

3. **Education Statistics (World Bank)**
   - URL: https://www.kaggle.com/datasets/theworldbank/education-statistics
   - Contains: Teacher-student ratios, education spending

4. **Academic Performance Dataset**
   - URL: https://www.kaggle.com/datasets/aljarah/xAPI-Edu-Data
   - Contains: Student interaction logs, assessment results

## Architecture

### Decision Tree Visualization

The visualization uses vis.js network to create an interactive tree:

```
Root Node (Decision)
├── Left Branch (Yes) → Leaf Node (Prediction)
└── Right Branch (No) → Decision Node
    ├── Left Branch (Yes) → Leaf Node
    └── Right Branch (No) → Leaf Node
```

**Node Types**:
- **Decision Nodes** (Blue Ellipses): Contain decision rules (e.g., "Teaching Years ≤ 2.5?")
- **Leaf Nodes** (Green Boxes): Contain predictions and statistics

### Data Flow

```
Kaggle API → Download Dataset → Parse CSV/JSON → 
Transform Data → Build Decision Tree → Render with vis.js
```

## File Structure

```
src/
├── templates/
│   └── decision-tree-page.js    # Main decision tree component
├── content/
│   └── pages/
│       └── decision-tree.md      # Page content and documentation
└── util/
    └── kaggle-api-example.js     # Kaggle API integration examples
```

## Development

### Running Development Server

```bash
npm run develop
```

Navigate to `http://localhost:8000/decision-tree`

### Building for Production

```bash
npm run build
npm run serve
```

## Customization

### Modifying the Decision Tree

Edit `src/templates/decision-tree-page.js`:

```javascript
const buildDecisionTree = () => {
  // Modify tree structure here
  // Add more decision nodes and leaves
  // Adjust thresholds and predictions
}
```

### Styling the Visualization

Modify the vis.js options in the useEffect hook:

```javascript
const options = {
  layout: {
    hierarchical: {
      direction: 'UD',        // 'UD' (up-down), 'DU', 'LR', 'RL'
      sortMethod: 'directed',
      levelSeparation: 150,   // Vertical spacing
      nodeSpacing: 200        // Horizontal spacing
    }
  },
  // Add more options...
}
```

### Changing Color Scheme

Update node colors in the `convertTreeToNetwork` function:

```javascript
nodes.push({
  // ...
  color: {
    background: '#your-color',
    border: '#your-border-color',
    highlight: {
      background: '#hover-color',
      border: '#hover-border-color'
    }
  }
})
```

## Troubleshooting

### Issue: vis-network not loading

**Solution**: The library is dynamically imported to avoid SSR issues. Ensure:
1. Browser environment is available (check `isClient` state)
2. Container ref is properly attached
3. Build is successful with no errors

### Issue: Kaggle API authentication fails

**Solution**: Check:
1. Credentials are correct in `~/.kaggle/kaggle.json`
2. File permissions: `chmod 600 ~/.kaggle/kaggle.json`
3. Environment variables are set correctly

### Issue: Dataset download fails

**Solution**:
1. Verify dataset exists and is publicly available
2. Check internet connection
3. Ensure sufficient disk space
4. Check Kaggle API quotas and limits

## Technical Notes

- **SSR Compatibility**: vis-network is dynamically imported using `import()` to prevent SSR issues with Gatsby
- **Performance**: The decision tree algorithm runs client-side with sample data. For large datasets, consider server-side processing
- **Browser Support**: Requires modern browsers with ES6 support
- **Accessibility**: Keyboard navigation enabled for the network visualization

## Future Enhancements

- [ ] Real-time data updates from Kaggle
- [ ] User-configurable tree parameters
- [ ] Export visualization as image/PDF
- [ ] Multiple dataset comparison
- [ ] Tree pruning and optimization controls
- [ ] ML model training integration

## License

This project follows the MIT license of the parent repository.

## Support

For issues related to:
- **vis.js network**: https://github.com/visjs/vis-network/issues
- **Kaggle API**: https://github.com/Kaggle/kaggle-api/issues
- **kaggle-node**: https://github.com/anorderh/kaggle-node/issues

## References

- vis.js Network Documentation: https://visjs.github.io/vis-network/docs/network/
- visNetwork R Package (inspiration): https://datastorm-open.github.io/visNetwork/tree.html
- Kaggle API Documentation: https://www.kaggle.com/docs/api
- kaggle-node GitHub: https://github.com/anorderh/kaggle-node
