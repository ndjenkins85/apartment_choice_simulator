# Apartment Choice Simulator - Interactive Web Tool

A modern, interactive single-page application for comparing apartment options using conjoint analysis. Built as a portfolio showcase tool.

## 🎯 Features

- **Smart Scoring**: Uses trained linear regression model to predict apartment value
- **Interactive Comparison**: Add multiple apartments and adjust 9 key features
- **Visual Analytics**: 
  - Bar chart comparing predicted values
  - Radar chart showing feature profiles
  - Dynamic ranking table
- **Pre-loaded Examples**: Portfolio visitors see working demo immediately
- **Fully Client-Side**: No backend required, runs entirely in browser
- **Mobile Responsive**: Works beautifully on all devices
- **Modern UI**: Clean dark theme with smooth animations

## 🏗️ How It Works

The tool uses conjoint analysis with a trained linear regression model to predict "willingness to pay" based on 9 apartment features:

1. **Commute to Work** (5 levels)
2. **Airport Access** (3 levels)
3. **Cleanliness** (4 levels)
4. **Size** (4 levels: studio to 2BR)
5. **Amenities** (5 levels)
6. **Location Vibe** (5 types)
7. **Additional Space** (4 types)
8. **Lease Period** (3 lengths)
9. **Sharehouse** (yes/no)

Each feature has a learned coefficient that contributes to the final predicted value.

## 🚀 Deployment

### Local Development
Simply open `index.html` in a browser. All dependencies are loaded via CDN.

### Docker Deployment
```bash
docker build -t apartment-sim .
docker run -p 3006:3006 -e PORT=3006 apartment-sim
```

### Railway Deployment
The app is configured to deploy to Railway at `ndjenkins.com/projects/apartment-sim/`:
- Dockerfile included
- nginx serves static files
- PORT environment variable supported (default: 3006)

## 📁 Files

- `index.html` - Main HTML structure
- `style.css` - Modern dark theme styling
- `app.js` - All business logic and visualization code
- `Dockerfile` - Container configuration
- `nginx.conf` - Web server configuration

## 🔬 Original Research

This web tool is based on the original Python/Jupyter notebook conjoint analysis. The model was trained on 25 example apartments to learn feature importance.

Original repo files:
- `conjoint_analysis.ipynb` - Model training notebook
- `examples.txt` - Training data
- `options.txt` - Feature definitions

## 🎨 Technology Stack

- Vanilla JavaScript (no framework bloat)
- Chart.js for visualizations
- CSS Grid & Flexbox for responsive layout
- nginx for serving static files

## 📊 Model Details

- **Intercept**: $2,911.84
- **Training Data**: 25 apartments with known prices
- **Features**: 9 categorical variables
- **Algorithm**: Linear Regression (scikit-learn)

The model predicts value as: `Value = Intercept + Σ(coefficient_i × feature_i)`

## 🎯 Use Cases

- Apartment hunting decision support
- Understanding feature trade-offs
- Estimating fair rent prices
- Portfolio demonstration of data science + web dev

---

**Built by Nick Jenkins** | [GitHub](https://github.com/ndjenkins85/apartment_choice_simulator)
